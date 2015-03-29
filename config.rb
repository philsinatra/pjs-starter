# Require any additional compass plugins here.
#
# Singularitygs grid system http://singularity.gs/
require "singularitygs"
#
# If grunting rather than CodeKit, require Bourbon
# require "bourbon"
#
# Use 'autoprefixer'
# https://www.npmjs.org/package/autoprefixer
require 'autoprefixer-rails'

on_stylesheet_saved do |file|
  css = File.read(file)
  File.open(file, 'w') do |io|
    io << AutoprefixerRails.process(css)
  end
end

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "./dev/css"
sass_dir = "./src/files/scss"
images_dir = "./dev/images"
javascripts_dir = "./dev/js"
fonts_dir = "./dev/fonts"

output_style = :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false
color_output = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass src/scss scss && rm -rf sass && mv scss sass
preferred_syntax = :scss
