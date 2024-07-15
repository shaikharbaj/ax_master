export const RTO_MASTER_MS_PATTERN = {
    TCP: {
      fetchAllRto: { role: 'fetchAllRto', cmd: 'fetch-all-rto' },
      fetchAllDeletedRto: {
        role: 'fetchAllDeletedRto',
        cmd: 'fetch-all-deleted-rto',
      },
      findRtoById: { role: 'findRtoById', cmd: 'find-rto-by-id' },
      createRto: { role: 'createRto', cmd: 'create-rto' },
      toggleRtoVisibility: {
        role: 'toggleRtoVisibility',
        cmd: 'toggle-rto-visibility',
      },
      updateRto: { role: 'updateRto', cmd: 'update-rto' },
      deleteRto: { role: 'deleteRto', cmd: 'delete-rto' },
      restoreRto: { role: 'restoreRto', cmd: 'restore-rto' },
    },
    KAFKA: {
      fetchAllRto: 'fetchAllRto',
      fetchAllDeletedRto: 'fetchAllDeletedRto',
      findRtoById: 'findRtoById',
      createRto: 'createCountry',
      toggleRtoVisibility: 'toggleRtoVisibility',
      updateRto: 'updateRto',
      deleteRto: 'deleteRto',
      restoreRto: 'restoreRto',
    },
    REDIS: {},
    RABBITMQ: {},
  };
  