export const MASTER_MS_STATES_PATTERN = {
  TCP: {
    fetchAllState: { role: 'fetchAllState', cmd: 'fetch-all-state' },
    fetchAllDeletedState: {
      role: 'fetchAllDeletedState',
      cmd: 'fetch-all-deleted-state',
    },
    restoreDeletedState: {
      role: 'restoreDeletedState',
      cmd: 'restore-deleted-state',
    },
    findStateById: { role: 'findStateById', cmd: 'find-state-by-id' },
    createState: { role: 'createState', cmd: 'create-state' },
    updateState: { role: 'updateState', cmd: 'update-state' },
    deleteState: { role: 'deleteState', cmd: 'delete-state' },
    toggleStateVisibility: {
      role: 'toggleStateVisibility',
      cmd: 'toggle-state-visibility',
    },
  },
  KAFKA: {
    fetchAllState: 'fetchAllState',
    fetchAllDeletedState: 'fetchAllDeletedState',
    restoreDeletedState: 'restoreDeletedState',
    findStateById: 'findStateById',
    createState: 'createState',
    updateState: 'updateState',
    deleteState: 'deleteState',
    toggleStateVisibility: 'toggleStateVisibility',
  },
  REDIS: {},
  RABBITMQ: {},
};
