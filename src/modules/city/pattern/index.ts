export const MASTER_MS_CITY_PATTERN = {
    TCP: {
      fetchAllCity: { role: 'fetchAllCity', cmd: 'fetch-all-city' },
      fetchAllDeletedCity: {
        role: 'fetchAllDeletedCity',
        cmd: 'fetch-all-deleted-city',
      },
      restoreDeletedCity: {
        role: 'restoreDeletedCity',
        cmd: 'restore-deleted-city',
      },
      findCityById: { role: 'findCityById', cmd: 'find-city-by-id' },
      createCity: { role: 'createCity', cmd: 'create-city' },
      updateCity: { role: 'updateCity', cmd: 'update-city' },
      deleteCity: { role: 'deleteCity', cmd: 'delete-city' },
      toggleCityVisibility: {
        role: 'toggleCityVisibility',
        cmd: 'toggle-city-visibility',
      },
    },
    KAFKA: {
      fetchAllCity: 'fetchAllCity',
      fetchAllDeletedCity: 'fetchAllDeletedCity',
      restoreDeletedCity: 'restoreDeletedCity',
      findCityById: 'findCityById',
      createCity: 'createCity',
      updateCity: 'updateCity',
      deleteCity: 'deleteCity',
      toggleCityVisibility: 'toggleCityVisibility',
    },
    REDIS: {},
    RABBITMQ: {},
  };
  