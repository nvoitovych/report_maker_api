/*
  User
 */
exports.UsersJsonArrayToObjArray = (usersJsonArray) => {
  // return array of user credentials objects
  return usersJsonArray.map((userJson) => {
    // return user credentials object(add it to array which will be returned)
    return userJsonToObj(userJson);
  });
};

exports.usersObjArrayToJsonArray = (usersObjArray) => {
  // return array of user credentials JSON objects
  return usersObjArray.map((userObj) => {
    // return user credentials JSON object(add it to array which will be returned)
    return userObjToJson(userObj);
  });
};

exports.userShortArrayForAdminObjToJson = (usersObjArray) => {
  // return array of user credentials short JSON objects
  return usersObjArray.map((userObj) => {
    // return user credentials JSON object(add it to array which will be returned)
    return userForAdminShortObjToJson(userObj);
  });
};

const userJsonToObj = exports.userJsonToObj = (userJson) => {
  if (typeof userJson !== "undefined") {
    // return user credentials object
    return {
      userId: userJson.user_id,
      login: userJson.login,
      passwordHash: userJson.password_hash,
      startLicense: userJson.start_license,
      endLicense: userJson.end_license,
      accessSecret: userJson.secret_token,
      accessToken: userJson.access_token,
      isBanned: userJson.is_banned,
      isAdmin: userJson.is_admin,
      twitterLink: userJson.twitter_link,
      twitterScreenName: userJson.twitter_screen_name,
      twitterUsername: userJson.twitter_username
    };
  }
};

const userObjToJson = exports.userObjToJson = (userObj) => {
  if (typeof userObj !== "undefined") {
    // return user credentials JSON object
    return {
      "user_id": userObj.userId,
      "login": userObj.login,
      "password_hash": userObj.passwordHash,
      "start_license": userObj.startLicense,
      "end_license": userObj.endLicense,
      "is_banned": userObj.isBanned,
      "twitter_link": userObj.twitterLink,
      "access_token": userObj.accessToken,
      "secret_token": userObj.secretToken,
      "twitter_screen_name": userObj.twitterScreenName,
      "twitter_username": userObj.twitterUsername
    };
  }
};

const userShortObjToJson = exports.userShortObjToJson = (userObj) => {
  if (typeof userObj !== "undefined") {
    // return user credentials JSON object
    return {
      "user_id": userObj.userId,
      "login": userObj.login,
      "start_license": userObj.startLicense,
      "end_license": userObj.endLicense,
      "twitter_link": userObj.twitterLink,
      "twitter_screen_name": userObj.twitterScreenName,
      "twitter_username": userObj.twitterUsername
    };
  }
};

const userForAdminShortObjToJson = exports.userForAdminShortObjToJson = (userJson) => {
  if (typeof userJson !== "undefined") {
    // return user credentials object
    return {
      userId: userJson.user_id,
      login: userJson.login,
      startLicense: userJson.start_license,
      endLicense: userJson.end_license,
      isBanned: userJson.is_banned
    };
  }
};

const userForAdminJsonToObj = exports.userForAdminJsonToObj = (userJson) => {
  if (typeof userJson !== "undefined") {
    // return user credentials object
    return {
      userId: userJson.user_id,
      login: userJson.login,
      startLicense: userJson.start_license,
      endLicense: userJson.end_license,
      isBanned: userJson.is_banned,
      twitterLink: userJson.twitter_link,
      twitterScreenName: userJson.twitter_screen_name,
      twitterUsername: userJson.twitter_username
    };
  }
};

/*
  Account
 */
exports.accountsJsonArrayToObjArray = (accountsJsonArray) => {
  // return array of accounts objects
  return accountsJsonArray.map((accountJson) => {
    // return account object(add it to array which will be returned)
    return accountJsonToObj(accountJson);
  });
};

exports.accountsObjArrayToJsonArray = (accountsObjArray) => {
  // return array of accounts JSON objects
  return accountsObjArray.map((accountObj) => {
    // return account JSON object(add it to array which will be returned)
    return accountObjToJson(accountObj);
  });
};

const accountJsonToObj = exports.accountJsonToObj = (accountJson) => {
  if (typeof accountJson !== "undefined") {
    // return account object
    return {
      accountId: accountJson.account_id,
      userId: accountJson.user_id,
      name: accountJson.name,
      surname: accountJson.surname,
      createdAt: accountJson.created_at,
      updatedAt: accountJson.updated_at
    };
  }
};

const accountObjToJson = exports.accountObjToJson = (accountObj) => {
  if (typeof accountObj !== "undefined") {
    // return account JSON
    return {
      "accountId": accountObj.accountId,
      "userId": accountObj.userId,
      "name": accountObj.name,
      "surname": accountObj.surname,
      "createdAt": accountObj.createdAt,
      "updatedAt": accountObj.updatedAt
    };
  }
};

/*
  Connection
 */
exports.connectionJsonArrayToObjArray = (connectionJsonArray) => {
  // return array of connection objects
  return connectionJsonArray.map((connectionJson) => {
    // return connection object(add it to array which will be returned)
    return connectionJsonToObj(connectionJson);
  });
};

const connectionJsonToObj = exports.connectionJsonToObj = (connectionJson) => {
  if (typeof connectionJson !== "undefined") {
    // return connection object
    return {
      connectionId: connectionJson.connection_id,
      userId: connectionJson.user_id,
      hashTag: connectionJson.hash_tag,
      linkToTwitter: connectionJson.link_to_twitter,
      reportType: connectionJson.report_type,
      weekday: connectionJson.weekday
    };
  }
};

const connectionObjToDBJson = exports.connectionObjToDBJson = (connectionObj) => {
  if (typeof connectionObj !== "undefined") {
    // return connection JSON object
    return {
      "connection_id": connectionObj.connectionId,
      "user_id": connectionObj.userId,
      "hash_tag": connectionObj.hashTag,
      "link_to_twitter": connectionObj.linkToTwitter,
      "report_type": connectionObj.reportType,
      "weekday": connectionObj.weekday
    };
  }
};

// exports.connectionObjArrayToDBJsonArray = (connectionObjArray) => {
//   // return array of connection JSON objects
//   return connectionObjArray.map((coordinatesObj) => {
//     // return connection JSON object(add it to array which will be returned)
//     return connectionObjToDBJson(coordinatesObj);
//   });
// };
exports.coordinatesShortJsonArrayToDBJsonArray = (connectionShortJsonArray, userId) => {
  // return array of short connection objects
  return connectionShortJsonArray.map((connectionShortJson) => {
    // return short connection object(add it to array which will be returned)
    return connectionShortJsonToDBJson(connectionShortJson, userId);
  });
};

const connectionShortJsonToDBJson = exports.connectionShortJsonToDBJson = (connectionShortJson, userId) => {
  if (typeof connectionShortJson !== "undefined") {
    // return short connection object
    return {
      user_id: userId,
      connection_id: connectionShortJson.connection_id,
      hash_tag: connectionShortJson.hash_tag,
      link_to_twitter: connectionShortJson.link_to_twitter,
      report_type: connectionShortJson.report_type,
      weekday: connectionShortJson.weekday
    };
  }
};

/*
  Report
 */
exports.reportJsonArrayToObjArray = (reportJsonArray) => {
  // return array of reports objects
  return reportJsonArray.map((reportJson) => {
    // return report object(add it to array which will be returned)
    return reportJsonToObj(reportJson);
  });
};

exports.reportShortJsonArrayToObjArray = (reportJsonArray) => {
  // return array of reports objects
  return reportJsonArray.map((reportJson) => {
    // return report object(add it to array which will be returned)
    return reportShortJsonToObj(reportJson);
  });
};

exports.reportObjArrayToJsonArray = (reportObjArray) => {
  // return array of reports JSON objects
  return reportObjArray.map((reportObj) => {
    // return report JSON object(add it to array which will be returned)
    return reportObjToJson(reportObj);
  });
};

const reportJsonToObj = exports.reportJsonToObj = (reportJson) => {
  if (typeof reportJson !== "undefined") {
    // return report object
    return {
      reportId: reportJson.report_id,
      userId: reportJson.user_id,
      data: reportJson.data,
      name: reportJson.name,
      createdAt: reportJson.created_at
    };
  }
};

const reportShortJsonToObj = exports.reportShortJsonToObj = (reportJson) => {
  if (typeof reportJson !== "undefined") {
    // return report object
    return {
      reportId: reportJson.report_id,
      name: reportJson.name,
      createdAt: reportJson.created_at
    };
  }
};

const reportObjToJson = exports.reportObjToJson = (reportObj) => {
  if (typeof reportObj !== "undefined") {
    // return report JSON
    return {
      "report_id": reportObj.reportId,
      "user_id": reportObj.userId,
      "data": reportObj.data,
      "name": reportObj.name,
      "created_at": reportObj.createdAt
    };
  }
};

const reportShortObjToJson = exports.reportShortObjToJson = (reportObj) => {
  if (typeof reportObj !== "undefined") {
    // return report JSON
    return {
      "user_id": reportObj.userId,
      "data": reportObj.data,
      "name": reportObj.name,
      "created_at": reportObj.createdAt
    };
  }
};
