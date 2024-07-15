export const FUEL_TYPE_MASTER_MS_PATTERN: any = {
    TCP: {
        fetchAllFuelType: { role: 'fetchAllFuelType', cmd: 'fetch-all-fuel-type' },
        fetchAllDeletedFuelType: { role: 'fetchAllDeletedFuelType', cmd: 'fetch-all-deleted-fuel-type' },
        findFuelTypeById: { role: 'findFuelTypeById', cmd: 'find-fuel-type-by-id' },
        createFuelType: { role: 'createFuelType', cmd: 'create-fuel-type' },
        updateFuelType: { role: 'updateFuelType', cmd: 'update-fuel-type' },
        restoreFuelType: { role: 'restoreFuelType', cmd: "restore=fuel-type" },
        toggleFuelTypeVisibility: { role: 'toggleFuelTypeVisibility', cmd: 'toggle-fuel-type-visibility' },
        deleteFuelType: { role: 'deleteFuelType', cmd: 'delete-fuel-type' },

    },
    KAFKA: {
        fetchAllFuelType: 'fetchAllFuelType',
        fetchAllDeletedFuelType: 'fetchAllDeletedFuelType',
        findFuelTypeById: 'findFuelTypeById',
        createFuelType: 'createFuelType',
        updateFuelType: 'updateFuelType',
        restoreFuelType: 'restoreFuelType',
        toggleFuelTypeVisibility: 'toggleFuelTypeVisibility',
        deleteFuelType: 'deleteFuelType',
    },
    REDIS: [],
    RABBITMQ: [],
};
