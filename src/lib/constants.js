module.exports = {
  HTTP_HEADERS: {
    CONTENT_TYPE: 'content-type',
    DEPRECATED: 'x-deprecated-endpoint',
  },
  HTTP_METHODS: { DELETE: 'delete', GET: 'get', POST: 'post', PUT: 'put' },
  JSON_SELECTORS: {
    ALLOW_DELETE_MULTIPLE: 'allowDeleteMultiple',
    ASSUME_ID_FIELD_MEANS_UPDATE: 'assumeIdFieldMeansUpdate',
    CORS_CONFIG: 'config.cors',
    DELETE_SEL: 'delete',
    ENABLE_DB_VERSIONING: 'config.enableDbVersioning',
    FIELDS: 'fields',
    GET_SEL: 'get',
    EXPRESS_IMPLEMENTATION: 'expressImplementation',
    LOGGER: 'logger',
    HTTP_METHOD: 'httpMethod',
    MIDDLEWARES: 'middlewares',
    OFFSET: 'offset',
    OPTIONS_ON_REQUEST: 'mergedRequestParameters',
    PAGE_SIZE: 'pageSize',
    POOL: 'dbConnPool',
    POOL_CONF: 'config.db',
    POOL_END: 'dbConnPool.end',
    POOL_KEY: 'dbConnPool.pgPool',
    POOL_QUERY: 'dbConnPool.query',
    POSTGRES_DB_VERSIONING_CONFIG: 'postgresDbVersioning',
    PUT_SEL: 'put',
    ROUTE: 'route',
    TABLE_NAME: 'tableName',
    TEST_LOGGER: 'config.testLogger',
    WEB_SERVER_APP: 'config.webServer.app',
    WEB_SERVER_BASE_PATH: 'config.webServer.basePath',
    WEB_SERVER_CONNECTIONS: 'config.webServer.connections',
    WEB_SERVER_INSTANCE: 'webServer.instance',
    WEB_SERVER_PORT: 'config.webServer.port',
    WEB_SERVER_START_TIMEOUT: 'config.webServer.startTimeoutMs',
    WEB_SERVER_STOP_TIMEOUT: 'config.webServer.stopTimeoutMs',
    WHERE: 'where',
  },
  MODEL: {
    DEFAULT_PAGE_SIZE: 10,
  },
};
