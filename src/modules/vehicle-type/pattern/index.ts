export const VEHICLE_TYPE_PATTERN: any = {
    TCP: {
        fetchAllVehicleType: { role: 'fetchAllVehicleType', cmd: 'fetch-all-vehicle-type' },
        fetchAllDeletedVehicleType: { role: 'fetchAllDeletedVehicleType', cmd: 'fetch-all-deleted-vehicle-type' },
        findVehicleTypeById: { role: 'findVehicleTypeById', cmd: 'find-vehicle-type-by-id' },
        createVehicleType: { role: 'createVehicleType', cmd: 'create-vehicle-type' },
        restoreVehicleType: { role: 'restoreVehicleType', cmd: "restore=vehicle-type" },
        updateVehicleType: { role: 'updateVehicleType', cmd: 'update-vehicle-type' },
        deleteVehicleType: { role: 'deleteVehicleType', cmd: 'delete-vehicle-type' },
        toggleVehicleTypeVisibility: { role: 'toggleVehicleTypeVisibility', cmd: 'toggle-vehicle-type-visibility' },
    },
    KAFKA: {
        fetchAllVehicleType: 'fetchAllVehicleType',
        fetchAllDeletedVehicleType: "fetchAllDeletedVehicleType",
        findVehicleTypeById: 'findVehicleTypeById',
        createVehicleType: 'createVehicleType',
        restoreVehicleType: "restoreVehicleType",
        updateVehicleType: 'updateVehicleType',
        deleteVehicleType: 'deleteVehicleType',
        toggleVehicleTypeVisibility: 'toggleVehicleTypeVisibility',
    },
    REDIS: [],
    RABBITMQ: [],
};
