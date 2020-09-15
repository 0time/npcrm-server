const {
  HTTP_METHODS: { DELETE, GET, PUT },
  JSON_SELECTORS: {
    EXPRESS_IMPLEMENTATION,
    HTTP_METHOD,
    OPTIONS_ON_REQUEST,
    ROUTE,
  },
} = require('../lib/constants');
const client = require('../lib/model/client');
const { get } = require('@0ti.me/tiny-pfp');
const sendResolution = require('../lib/send-resolution');

const CLIENT_ROUTE = '/client';

module.exports = (context) => [
  {
    [ROUTE]: CLIENT_ROUTE,
    [HTTP_METHOD]: GET,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      client(context).get(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
  {
    [ROUTE]: CLIENT_ROUTE,
    [HTTP_METHOD]: PUT,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      client(context).put(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
  {
    [ROUTE]: CLIENT_ROUTE,
    [HTTP_METHOD]: DELETE,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      client(context).delete(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
];
