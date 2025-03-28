echo "permit nopass Administrator as root" | doas tee -a /usr/local/etc/doas.conf


#node search first
doas pkg install -y node20 npm-node20


#mariadb

echo "Installation  mariadb";
echo "Creation of the SQL file:";

# Prompt for the database username
DB_USER="datalogger"
DB_NAME="datalogger"



while true; do
    read -s -p "Enter the password for the new database  $DB_USER: " DB_PASSWORD
    echo
    read -s -p "Confirm the password: " DB_PASSWORD_CONFIRM
    echo

    # Check if passwords match
    if [ "$DB_PASSWORD" = "$DB_PASSWORD_CONFIRM" ]; then
        break
    else
        echo "Passwords do not match. Please try again."
    fi
done

echo "Password set successfully."

SQL_FILE=" bsd-config/create-db.sql"


cat <<EOF > $SQL_FILE
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE USER '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

echo "Database creation script saved to $SQL_FILE."

doas pkg install -y mariadb106-server

doas sysrc mysql_enable="YES" && doas service mysql-server start 



doas mysql_secure_installation

doas printf "\nY\n$DB_PASSWORD\n$DB_PASSWORD\nY\nY\nY\nY\n" | mysql_secure_installation


echo "Database and user creation, and importing structure and data."


echo "Enter the password for the $DB_USER database (user $DB_USER)"

mysql -u root -p < bsd-config/create-db.sql

echo "Enter the password for the $DB_USER database (user $DB_USER)"

mysql -u root -p datalogger < bsd-config/datalogger.sql

echo "Edit file mysql/conf.d/server.cnf"

sed -i '' 's/\r//g' "bsd-config/datalogger-install-two.sh" 

MYSQL_CONF="/usr/local/etc/mysql/conf.d/server.cnf"

if [ ! -f "$MYSQL_CONF" ]; then
    echo "MySQL configuration file not found: $MYSQL_CONF"
    exit 1
fi

doas sed -i '' 's/\r//g' "$MYSQL_CONF"

doas sed -i '' 's/^bind-address[[:space:]]*=[[:space:]]*127.0.0.1/bind-address = 0.0.0.0/' "$MYSQL_CONF"

if ! doas grep -q "^bind-address" "$MYSQL_CONF"; then
    echo '[mysqld]' | doas tee -a "$MYSQL_CONF" > /dev/null
    echo 'bind-address = 0.0.0.0' | doas tee -a "$MYSQL_CONF" > /dev/null
fi


doas service mysql-server restart
echo "MySQL bind-address successfully set to 0.0.0.0!"

#redis

echo "Installation  redis";

doas pkg install -y redis
doas sysrc redis_enable="YES"
doas service redis start

echo "Edit file redis.cnf"


REDIS_CONF="/usr/local/etc/redis.conf"


if grep -q "^bind " "$REDIS_CONF"; then
    doas sed -i '' 's/^bind .*/bind 0.0.0.0/' "$REDIS_CONF"
else
    echo "bind 0.0.0.0" | doas tee -a "$REDIS_CONF"
fi

if grep -q "^protected-mode " "$REDIS_CONF"; then
    doas sed -i '' 's/^protected-mode .*/protected-mode no/' "$REDIS_CONF"
else
    echo "protected-mode no" | doas tee -a "$REDIS_CONF"
fi


doas service redis restart

echo "Installation  mongodb";

#mongodb

doas pkg install -y mongodb70

doas sysrc mongod_enable="YES"
doas service mongod start



doas npx mongosh < bsd-config/init-mongo.js

echo "Edit file mongodb.cnf"


MONGODB_CONF="/usr/local/etc/mongodb.conf"


if [ ! -f "$MONGODB_CONF" ]; then
    echo "MongoDB configuration file not found: $MONGODB_CONF"
    exit 1
fi


doas sed -i '' 's/\r//g' "$MONGODB_CONF"


if grep -q "^[[:space:]]*bindIp:" "$MONGODB_CONF"; then
    doas sed -i '' 's/^\([[:space:]]*bindIp:\)[[:space:]]*.*/\1 0.0.0.0/' "$MONGODB_CONF"
else
    doas sed -i '' '/^net:/a\
  bindIp: 0.0.0.0' "$MONGODB_CONF"
fi


doas service mongod restart

echo "MongoDB bindIp successfully set to 0.0.0.0!"


echo "Installation  mosquitto";


#Mosquitto


doas pkg install -y mosquitto


doas sysrc mosquitto_enable="YES"
doas service mosquitto start


echo "Edit file mosquitto.conf"

MOSQUITTO_CONF="/usr/local/etc/mosquitto/mosquitto.conf"


if [ ! -f "$MOSQUITTO_CONF" ]; then
    echo "Mosquitto configuration file not found: $MOSQUITTO_CONF"
    exit 1
fi

doas sed -i '' 's/\r//g' "$MOSQUITTO_CONF"

if grep -q "^#listener" "$MOSQUITTO_CONF"; then
    echo "Updating listener configuration..."
    doas sed -i '' 's|^#listener.*|listener 1883 0.0.0.0|' "$MOSQUITTO_CONF"
fi

if grep -q "^#allow_anonymous false" "$MOSQUITTO_CONF"; then
    echo "Enabling anonymous access..."
    doas sed -i '' 's/^#allow_anonymous false/allow_anonymous true/' "$MOSQUITTO_CONF"
fi


doas service mosquitto restart


echo "Disabling PF firewall and removing automatic startup";

#Firewall 

doas service pf stop
doas sysrc pf_enable="NO"


reboot
