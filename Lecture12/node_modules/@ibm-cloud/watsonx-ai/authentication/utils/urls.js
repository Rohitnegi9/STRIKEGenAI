"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_AWS_URLS = exports.GOVCLOUD_PROD_TOKEN_URL = exports.GOVCLOUD_PREPROD_TOKEN_URL = exports.AWS_TEST_TOKEN_URL = exports.AWS_PROD_TOKEN_URL = void 0;
exports.AWS_PROD_TOKEN_URL = 'https://account-iam.platform.saas.ibm.com';
exports.AWS_TEST_TOKEN_URL = 'https://account-iam.platform.test.saas.ibm.com';
exports.GOVCLOUD_PREPROD_TOKEN_URL = 'https://account-iam.awsg.usge1.private.platform.prep.ibmforusgov.com';
exports.GOVCLOUD_PROD_TOKEN_URL = 'https://account-iam.awsg.usge1.private.platform.ibmforusgov.com';
exports.AUTH_AWS_URLS = {
    'https://ap-south-1.aws.wxai.ibm.com': exports.AWS_PROD_TOKEN_URL,
    'https://private.ap-south-1.aws.wxai.ibm.com': exports.AWS_PROD_TOKEN_URL,
    'https://private.dev.aws.wxai.ibm.com': exports.AWS_TEST_TOKEN_URL,
    'https://private.test.aws.wxai.ibm.com': exports.AWS_TEST_TOKEN_URL,
    'https://test.aws.wxai.ibm.com': exports.AWS_TEST_TOKEN_URL,
    'https://dev.aws.wxai.ibm.com': exports.AWS_TEST_TOKEN_URL,
    'https://wxai.prep.ibmforusgov.com': exports.GOVCLOUD_PREPROD_TOKEN_URL,
    'https://private.wxai.prep.ibmforusgov.com': exports.GOVCLOUD_PREPROD_TOKEN_URL,
    'https://wxai.ibmforusgov.com': exports.GOVCLOUD_PROD_TOKEN_URL,
    'https://private.wxai.ibmforusgov.com': exports.GOVCLOUD_PROD_TOKEN_URL,
};
//# sourceMappingURL=urls.js.map