const {
  HTTP_METHODS: { DELETE, GET, PUT },
  JSON_SELECTORS: {
    EXPRESS_IMPLEMENTATION,
    HTTP_METHOD,
    OPTIONS_ON_REQUEST,
    ROUTE,
  },
} = require('../lib/constants');
const volunteer = require('../lib/model/volunteer');
const { get } = require('@0ti.me/tiny-pfp');
const sendResolution = require('../lib/send-resolution');

const VOLUNTEER_ROUTE = '/volunteer';

module.exports = (context) => [
  {
    [ROUTE]: VOLUNTEER_ROUTE,
    [HTTP_METHOD]: GET,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      volunteer(context).get(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
  {
    [ROUTE]: VOLUNTEER_ROUTE,
    [HTTP_METHOD]: PUT,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      volunteer(context).put(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
  {
    [ROUTE]: VOLUNTEER_ROUTE,
    [HTTP_METHOD]: DELETE,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      volunteer(context).delete(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
];
