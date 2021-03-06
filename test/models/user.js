
module.exports = function(sequelize, Types) {
  return sequelize.define('user',
    {
      name: {
        type: Types.STRING,
        allowNull: false
      },
      description: Types.TEXT,
      nationalId: {
        type: Types.STRING,
        unique: true
      }
    },
    {
      classMethods: {
        associate: function(models) {
          models.user.hasMany(models.address);
          models.user.belongsToMany(models.tag, {through: 'usr_tags'});
        }
      },
      scopes: {
        withA: {
          where: {
            name: {
              $like: 'a%'
            }
          }
        }
      }
    }
  );
};
