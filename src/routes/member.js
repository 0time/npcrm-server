const {
  HTTP_METHODS: { DELETE, GET, PUT },
  JSON_SELECTORS: {
    EXPRESS_IMPLEMENTATION,
    HTTP_METHOD,
    OPTIONS_ON_REQUEST,
    ROUTE,
  },
} = require('../lib/constants');
const member = require('../lib/model/member');
const { get } = require('@0ti.me/tiny-pfp');
const sendResolution = require('../lib/send-resolution');

const MEMBER_ROUTE = '/member';

module.exports = (context) => [
  {
    [ROUTE]: MEMBER_ROUTE,
    [HTTP_METHOD]: GET,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      member(context).get(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
  {
    [ROUTE]: MEMBER_ROUTE,
    [HTTP_METHOD]: PUT,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      member(context).put(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
  {
    [ROUTE]: MEMBER_ROUTE,
    [HTTP_METHOD]: DELETE,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      member(context).delete(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
];
