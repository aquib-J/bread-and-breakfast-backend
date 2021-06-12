const { Logger, Migration: migrate } = require('../utils');
const Config = require('../config');
const { sequelize, models } = require('./sequelize');
const Redis = require('./redis');
const { Queues } = require('../queues');
const { mockAll } = require('./../utils').mockAll;
const { getCryptoRandom: GCR } = require('./../utils').utilityMethods;
const expressLoader = require('./express');

const loader = async function ({ expressApp }) {
  try {
    if (Config.sequelizeConfig.autoMigrate === 'true' || Config.sequelizeConfig.autoMigrate === true) {
      await migrate();
      Logger.log('info', '🔥 DB Migrated 🔥');
    }

    if (Config.dataMock) {
      await mockAll(Config.noOfMockRecords, models, GCR);
      Logger.log('info', '🍻 ✔️  DB seeded with mock data **');
    }
    await sequelize.authenticate();
    Logger.log('info', '🍻 ✔️  DB loaded and connected! **');

    if (Config.redis.enabled) {
      await Redis.init();
      Redis.getClient().on('connect', () => {
        Logger.log('info', '🍻 ✔️  Redis connected **');
      });
    } else {
      Logger.log('info', '** Redis disabled **');
    }
    await Queues.IntializeConsumersAndAttachEvents();
    Logger.log('info', '🍻 ✔️ Queues set up and consumers ready');

    await expressLoader.loadModules({ app: expressApp });
    Logger.log('info', '🚀 ✔️  Express loaded 🚀');
  } catch (err) {
    console.error(err);
  }
};

module.exports = loader;
