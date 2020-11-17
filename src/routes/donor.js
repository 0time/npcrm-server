const {
  HTTP_METHODS: { DELETE, GET, PUT },
  JSON_SELECTORS: {
    EXPRESS_IMPLEMENTATION,
    HTTP_METHOD,
    OPTIONS_ON_REQUEST,
    ROUTE,
  },
} = require('../lib/constants');
const donor = require('../lib/model/donor');
const { get } = require('@0ti.me/tiny-pfp');
const sendResolution = require('../lib/send-resolution');

const DONOR_ROUTE = '/donor';

module.exports = (context) => [
  {
    [ROUTE]: DONOR_ROUTE,
    [HTTP_METHOD]: GET,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      donor(context).get(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
  {
    [ROUTE]: DONOR_ROUTE,
    [HTTP_METHOD]: PUT,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      donor(context).put(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
  {
    [ROUTE]: DONOR_ROUTE,
    [HTTP_METHOD]: DELETE,
    [EXPRESS_IMPLEMENTATION]: sendResolution(context, ({ req }) =>
      donor(context).delete(get(req, OPTIONS_ON_REQUEST)),
    ),
  },
];
