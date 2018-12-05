const converter = require("../helpers/entityMapper");
const env = process.env.NODE_ENV || "development";

const config = require("../../knexfile")[env];
const knex = require("knex")(config);

exports.createUser = async (login, password) => {
  // after inserting in response we receive id(or ids) of inserts
  const endDate = new Date();
  // trial license period
  const numberOfDaysToAdd = 5;
  endDate.setDate(endDate.getDate() + numberOfDaysToAdd);
  const insertedUserId = await knex("user_credentials").insert({login: login,
    password_hash: password,
    is_admin: false,
    is_banned: false,
    start_date: new Date(),
    end_date: endDate
  });
  return getUserById(insertedUserId);
};

exports.updateUserLicense = async (userId, startDate, endDate) => {
  const updatedUserId = await knex("user_credentials").insert({
    start_date: startDate,
    end_date: endDate
  }).where({user_id: userId});
  return getUserById(updatedUserId);
};

exports.updateUser = async (userId, accessToken, secretToken, twitterLink, twitterUsername, twitterScreenName) => {
  const updatedUserId = await knex("user_credentials").insert({
    access_token: accessToken,
    secret_token: secretToken,
    twitter_link: twitterLink,
    twitter_username: twitterUsername,
    twitter_screen_name: twitterScreenName
  }).where({user_id: userId});
  return getUserById(updatedUserId);
};

exports.changeBanStatusUser = async (userId) => {
  const bannedUserId = await knex("user_credentials").insert({is_banned: true}).where({user_id: userId});
  return getUserById(bannedUserId);
};

exports.deleteUser = async (userId) => {
  const deletedAccountId = await knex("account").where({user_id: userId}).del;
  const deletedUserId = await knex("user_credentials").where({user_id: userId}).del;
  return true;
};

exports.createAccount = async (userId) => {
  // after inserting in response we receive id(or ids) of inserts
  const insertedAccountId = await knex("account").insert({user_id: userId, created_at: new Date()});
  return getAccountById(insertedAccountId);
};

const getAccountById = exports.getAccountById = async (accountId) => {
  const resultAccountJsonArray = await knex("account").where({account_id: accountId}).limit(1);
  return converter.accountJsonToObj(resultAccountJsonArray[0]);
};

exports.getAccountByUserId = async (userId) => {
  const resultAccountJsonArray = await knex("account").where({user_id: userId}).limit(1);
  return converter.accountJsonToObj(resultAccountJsonArray[0]);
};

const getUserById = exports.getUserById = async (userId) => {
  const resultUserJsonArray = await knex("user_credentials").where({user_id: userId}).limit(1);
  if (typeof resultUserJsonArray !== "undefined" && resultUserJsonArray.length > 0) {
    // the array is defined and has at least one element
    return converter.userJsonToObj(resultUserJsonArray[0]);
  } else {
    const error = new Error("User doesn't exist");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
};

exports.getUserByLogin = async (login) => {
  const resultUserJsonArray = await knex("user_credentials").where({login: login}).limit(1);
  if (typeof resultUserJsonArray !== "undefined" && resultUserJsonArray.length > 0) {
    // the array is defined and has at least one element
    return converter.userJsonToObj(resultUserJsonArray[0]);
  } else {
    const error = new Error("User doesn't exist");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
};

exports.getAllAccounts = async () => {
  return converter.accountsJsonArrayToObjArray(await knex("account").select("*"));
};

exports.getAllUsers = async () => {
  return converter.UsersJsonArrayToObjArray(await knex("user_credentials").select("*"));
};

exports.getAllBannedUsers = async () => {
  return converter.UsersJsonArrayToObjArray(await knex("user_credentials").where({is_banned: true}));
};

/*
  Connection
 */
const getUserConnectionByUserId = exports.getUserConnectionByUserId = async (userId) => {
  const resultConnectionJsonArray = await knex("connection").where({user_id: userId});
  return converter.connectionJsonArrayToObjArray(resultConnectionJsonArray);
};

const getUserConnectionById = exports.getUserConnectionByConnectionId = async (connectionId) => {
  const resultConnectionJsonArray = await knex("connection").where({connection_id: connectionId});
  return converter.connectionJsonArrayToObjArray(resultConnectionJsonArray);
};

const getUserConnectionByWeekday = exports.getUserConnectionByWeekday = async (userId, weekday) => {
  const resultConnectionJsonArray = await knex("connection").where({weekday: weekday, user_id: userId});
  return converter.connectionJsonArrayToObjArray(resultConnectionJsonArray);
};

exports.createConnection = async (connection) => {
  const resultConnectionJsonArray = await knex("connection").insert(connection);
  return getUserConnectionById(resultConnectionJsonArray);
};

exports.updateConnectionById = async (connection, connectionId) => {
  const updatedConnectionId = await knex("connection").insert({
    "connection_id": connection.connectionId,
    "user_id": connection.userId,
    "hash_tag": connection.hashTag,
    "link_to_twitter": connection.linkToTwitter,
    "report_type": connection.reportType,
    "weekday": connection.weekday
  }).where({connection_id: connectionId});
  return getUserConnectionById(updatedConnectionId);
};

exports.deleteConnection = async (connectionId) => {
  const deletedconnectionId = await knex("connection").where({connection_id: connectionId}).del;
  return true;
};

/*
  Report
 */
const getReportByUserId = exports.getReportByUserId = async (userId) => {
  const resultReportJsonArray = await knex("report").where({user_id: userId});
  return converter.reportShortJsonArrayToObjArray(resultReportJsonArray);
};

const getReportById = exports.getReportById = async (reportId) => {
  const resultReportJsonArray = await knex("connection").where({report_id: reportId});
  return converter.reportJsonArrayToObjArray(resultReportJsonArray);
};

exports.createReport = async (reportArray, userId) => {
  const resultReportJsonArray = await knex("connection").insert(reportArray);
  return getReportByUserId(userId);
};

exports.updateConnectionById = async (connection, connectionId) => {
  const updatedConnectionId = await knex("connection").insert({
    "connection_id": connection.connectionId,
    "user_id": connection.userId,
    "hash_tag": connection.hashTag,
    "link_to_twitter": connection.linkToTwitter,
    "report_type": connection.reportType,
    "weekday": connection.weekday
  }).where({connection_id: connectionId});
  return getUserConnectionById(updatedConnectionId);
};

exports.deleteReportById = async (reportId) => {
  const deletedReportId = await knex("report").where({report_id: reportId}).del;
  return true;
};

exports.deleteAllReports = async (userId) => {
  const deletedReportsId = await knex("report").where({user_id: userId}).del;
  return true;
};
