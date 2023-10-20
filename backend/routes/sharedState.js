// This file defines a shared JSON object used between endpoints to determine if
// a trip is uploading pictures. If a trip is uploading pictures, we do not
// add any new locations to prevent database conflicts.
module.exports = {
    uploadingTrips: {}
};