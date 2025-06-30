import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

export default (sequelize) => {
  const Employe = sequelize.define('Employe', {
    nom: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: true },
    poste: { type: DataTypes.STRING, allowNull: true, defaultValue: 'employee' },
    password: { type: DataTypes.STRING, allowNull: false },
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (employe) => {
        if (employe.password) {
          const salt = await bcrypt.genSalt(10);
          employe.password = await bcrypt.hash(employe.password, salt);
        }
      }
    }
  });

  Employe.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  return Employe;
}; 