const {
  HTTP_METHODS: { DELETE, GET, PUT },
  JSON_SELECTORS: {
    EXPRESS_IMPLEMENTATION,
    HTTP_METHOD,
    OPTIONS_ON_REQUEST,
    ROUTE,
  },
} = require('../lib/constants');
const staff = require('../lib/model/staff');
const { get } = require('@0ti.me/tiny-pfp');
const sendResolution = require('../lib/send-resolution');

const STAFF_ROUTE = '/staff';

module.exports = (context) => [
  {
    [ROUTE]: STAFF_ROUTE,
    [HTTP_METHOD]: GET,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      staff(context).get(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
  {
    [ROUTE]: STAFF_ROUTE,
    [HTTP_METHOD]: PUT,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      staff(context).put(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
  {
    [ROUTE]: STAFF_ROUTE,
    [HTTP_METHOD]: DELETE,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      staff(context).delete(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
];
