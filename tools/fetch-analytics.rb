#!/usr/bin/env ruby
# frozen_string_literal: true
#
# 从 GoatCounter 拉站点统计，写成 _data/analytics.json。
#
# 为什么不在前端直接请求 GoatCounter：它的 API 需要 token，token 一旦写进
# 前端 JS，任何访客都能拿去读走全部统计。所以放在构建时跑，token 只存在于
# CI 的 secret 里。
#
# 用法：
#   GOATCOUNTER_API_TOKEN=xxx ruby tools/fetch-analytics.rb
#   GOATCOUNTER_API_TOKEN=xxx ruby tools/fetch-analytics.rb --dump   # 打印原始响应
#
# 环境变量：
#   GOATCOUNTER_API_TOKEN  必填，GoatCounter → Settings → API 里建的 read token
#   GOATCOUNTER_ID         站点代码，缺省读 _config.yml 的 analytics.goatcounter.id
#   GOATCOUNTER_DAYS       往回取多少天，缺省 180
#   GOATCOUNTER_API_BASE   覆盖 API 地址，本地拿 mock 测的时候用
#
# 失败时不会写坏数据：保留原有文件，退出码 0，让构建继续。

require 'net/http'
require 'json'
require 'yaml'
require 'time'
require 'uri'

ROOT = File.expand_path('..', __dir__)
OUT = File.join(ROOT, '_data', 'analytics.json')

def config
  @config ||= YAML.safe_load_file(File.join(ROOT, '_config.yml'), aliases: true) || {}
end

def api_base
  return ENV['GOATCOUNTER_API_BASE'] if ENV['GOATCOUNTER_API_BASE'] && !ENV['GOATCOUNTER_API_BASE'].empty?

  id = ENV['GOATCOUNTER_ID'] || config.dig('analytics', 'goatcounter', 'id')
  raise '没有配置 GoatCounter 站点 id' if id.to_s.empty?

  "https://#{id}.goatcounter.com/api/v0"
end

TOKEN = ENV['GOATCOUNTER_API_TOKEN'].to_s

def get(path, params = {})
  uri = URI("#{api_base}#{path}")
  uri.query = URI.encode_www_form(params) unless params.empty?

  req = Net::HTTP::Get.new(uri)
  req['Authorization'] = "Bearer #{TOKEN}"
  req['Content-Type'] = 'application/json'

  res = Net::HTTP.start(
    uri.host, uri.port,
    use_ssl: uri.scheme == 'https',
    open_timeout: 15, read_timeout: 30
  ) { |http| http.request(req) }

  raise "GET #{uri.path} -> HTTP #{res.code}: #{res.body.to_s[0, 200]}" unless res.code.to_i == 200

  JSON.parse(res.body)
end

def main
  if TOKEN.empty?
    warn 'GOATCOUNTER_API_TOKEN 未设置，跳过（保留现有 _data/analytics.json）'
    return
  end

  days = (ENV['GOATCOUNTER_DAYS'] || '180').to_i
  finish = Time.now.utc
  start = finish - (days * 86_400)
  range = { start: start.strftime('%Y-%m-%dT%H:%M:%SZ'), end: finish.strftime('%Y-%m-%dT%H:%M:%SZ') }

  puts "拉取 #{days} 天：#{range[:start]} .. #{range[:end]}"

  locations = get('/stats/locations', range.merge(limit: 100))
  hits      = get('/stats/hits', range.merge(limit: 100, group: 'day'))

  if ARGV.include?('--dump')
    puts '--- locations ---'
    puts JSON.pretty_generate(locations)[0, 3000]
    puts '--- hits ---'
    puts JSON.pretty_generate(hits)[0, 3000]
  end

  # ---- 地区 ----------------------------------------------------------
  # 形状：{ "stats": [ { "id": "cn", "name": "China", "count": 12 }, ... ], "more": false }
  countries = Array(locations['stats']).map do |row|
    code = (row['id'] || row['name']).to_s.upcase
    next nil unless code.match?(/\A[A-Z]{2}\z/)

    { 'c' => code, 'n' => row['name'].to_s.empty? ? code : row['name'], 'v' => row['count'].to_i }
  end.compact.reject { |c| c['v'].zero? }.sort_by { |c| -c['v'] }

  # ---- 日序列 --------------------------------------------------------
  # /stats/hits 返回 { "hits": [ { "path": {...}, "stats": [ {day, daily, ...} ] } ], "total": N }
  # 每个 path 各自带一份按天数组，逐天相加就是全站曲线。
  per_day = Hash.new { |h, k| h[k] = { 'v' => 0, 'u' => 0 } }
  Array(hits['hits']).each do |page|
    Array(page['stats']).each do |row|
      day = row['day'].to_s
      next if day.empty?

      per_day[day]['v'] += row['daily'].to_i
      # 唯一访客：不同版本字段名不一致，有就用，没有就退回浏览量
      per_day[day]['u'] += (row['count_unique'] || row['daily']).to_i
    end
  end

  daily = per_day.keys.sort.map { |d| { 'd' => d, 'v' => per_day[d]['v'], 'u' => per_day[d]['u'] } }

  views = daily.sum { |r| r['v'] }
  visitors = daily.sum { |r| r['u'] }

  payload = {
    'available' => true,
    'generated_at' => finish.strftime('%Y-%m-%dT%H:%M:%SZ'),
    'source' => 'GoatCounter',
    'totals' => { 'views' => views, 'visitors' => visitors },
    'daily' => daily,
    'countries' => countries
  }

  File.write(OUT, JSON.pretty_generate(payload) + "\n")
  puts "写入 #{OUT}"
  puts "  #{days} 天，#{daily.size} 个有数据的日子，#{countries.size} 个国家/地区"
  puts "  浏览 #{views}，访客 #{visitors}"
rescue StandardError => e
  # 构建不能因为统计挂掉。保留原文件，只报警。
  warn "统计拉取失败：#{e.class}: #{e.message}"
  warn '保留 _data/analytics.json 原有内容。'
end

main if $PROGRAM_NAME == __FILE__
