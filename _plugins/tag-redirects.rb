#!/usr/bin/env ruby
#
# 旧标签跳转页
#
# 标签整理时把 30 个只用过一次的标签合并进了更通用的标签，这些标签的
# 页面（/tags/xxx/）随之不再生成。为了让站外收藏/转发的旧链接不 404，
# 这里为每个旧标签生成一个 meta refresh 跳转页，指向它合并后的新标签。

module TagRedirects
  # 旧标签 => 新标签
  REDIRECTS = {
    # 论文记录：PRL / PRX / CPL 三篇现在统一带 publication
    "PRL" => "publication",
    "PRX" => "publication",
    "CPL" => "publication",

    # 技巧类文章（phone / Word / API / Feishu 等）
    "APN" => "tricks",
    "phone" => "tricks",
    "Word" => "tricks",
    "Handwriting" => "tricks",
    "API" => "tricks",
    "News" => "tricks",
    "Feishu" => "tricks",
    "paper" => "tricks",
    "Zotero" => "tricks",

    # 项目类
    "QRSync" => "html",
    "toys" => "html",
    "echowave" => "html",
    "music" => "html",
    "a-share" => "quant",
    "dashboard" => "quant",
    "finance" => "quant",
    "flask" => "python",
    "agent" => "llm",
    "agent-street" => "llm",
    "simulation" => "llm",

    # 人生里程碑
    "job" => "milestone",
    "offer" => "milestone",
    "work" => "milestone",
    "salary" => "milestone",
    "first" => "milestone",
    "graduation" => "milestone",
    "phd" => "milestone",
  }.freeze

  TEMPLATE = <<~HTML
    <!doctype html>
    <html lang="%<lang>s">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Redirecting to %<label_target>s</title>
        <link rel="canonical" href="%<target>s">
        <meta name="robots" content="noindex, follow">
        <meta http-equiv="refresh" content="0; url=%<target>s">
        <style>
          body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
                 margin: 4rem auto; max-width: 32rem; padding: 0 1rem; line-height: 1.6; }
          a { word-break: break-all; }
        </style>
      </head>
      <body>
        <p>“%<label>s” has been merged into “%<label_target>s”.</p>
        <p>Redirecting to <a href="%<target>s">%<target>s</a>…</p>
      </body>
    </html>
  HTML
end

class TagRedirectGenerator < Jekyll::Generator
  safe true
  priority :lowest # 在 jekyll-archives 生成完标签页之后再跑

  def generate(site)
    lang = site.config["lang"] || "en"
    base = site.config["baseurl"].to_s

    TagRedirects::REDIRECTS.each do |old_tag, new_tag|
      old_slug = Jekyll::Utils.slugify(old_tag)
      new_slug = Jekyll::Utils.slugify(new_tag)
      target = "#{base}/tags/#{new_slug}/"

      page = Jekyll::PageWithoutAFile.new(
        site, site.source, File.join("tags", old_slug), "index.html"
      )
      page.content = format(
        TagRedirects::TEMPLATE,
        lang: lang, label: old_tag, label_target: new_tag, target: target
      )
      page.data["layout"] = nil
      page.data["sitemap"] = false # 跳转页不进 sitemap
      site.pages << page
    end

    Jekyll.logger.info "Tag redirects:", "generated #{TagRedirects::REDIRECTS.size} pages"
  end
end
