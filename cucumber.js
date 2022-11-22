module.exports = {
    default: [
        'tests/features/**/*.feature',
        '--require tests/support/**/*.js',
        '--format json:reports/cucumber_report.json',
        '--publish-quiet'
    ].join(' '),
}
