const moment = require("moment");

module.exports = function(eleventyConfig) {
    const defaultLocale = 'de';

    // Copy files to dist
    eleventyConfig
        .addPassthroughCopy("css")
        .addPassthroughCopy("js")
        .addPassthroughCopy("files");

    // Date filter (localized)
    // https://www.webstoemp.com/blog/multilingual-sites-eleventy/
    eleventyConfig.addNunjucksFilter(
        "date",
        function(date, format, locale) {
            locale = locale ? locale : defaultLocale;
            moment.locale(locale);

            return moment(date).format(format);
        }
    );

    // Translation filter
    eleventyConfig.addNunjucksFilter(
        "trans",
        function(string, locale, locales, context) {
            locale = locale ? locale : defaultLocale;
            locales = locales ? locales : null;

            if (locale && locales) {
                return locales[locale][string];
            }

            return '';
        }
    );

    return {
        dir: {
            input: 'src',
            output: 'dist'
        }
    };
};