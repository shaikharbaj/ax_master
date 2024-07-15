export const YARD_MASTER_MS_PATTERN = {
    TCP: {
      fetchAllYard: { role: 'fetchAllYard', cmd: 'fetch-all-yard' },
      fetchAllDeletedYard: {
        role: 'fetchAllDeletedYard',
        cmd: 'fetch-all-deleted-yard',
      },
      findYardById: { role: 'findYardById', cmd: 'find-yard-by-id' },
      createYard: { role: 'createYard', cmd: 'create-yard' },
      toggleYardVisibility: {
        role: 'toggleYardVisibility',
        cmd: 'toggle-yard-visibility',
      },
      updateYard: { role: 'updateYard', cmd: 'update-yard' },
      deleteYard: { role: 'deleteYard', cmd: 'delete-yard' },
      restoreYard: { role: 'restoreYard', cmd: 'restore-yard' },
    },
    KAFKA: {
      fetchAllYard: 'fetchAllYard',
      fetchAllDeletedYard: 'fetchAllDeletedYard',
      findYardById: 'findYardById',
      createYard: 'createYard',
      toggleYardVisibility: 'toggleYardVisibility',
      updateYard: 'updateYard',
      deleteYard: 'deleteYard',
      restoreYard: 'restoreYard',
    },
      REDIS: {},
      RABBITMQ: {},
    };
    