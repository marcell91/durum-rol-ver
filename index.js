const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const cfg = require('./settings/config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});

// 
client.on('ready', () => {
  console.log(`${client.user.tag} giriş yaptı!`);
  client.user.setStatus('idle');
  setInterval(() => {
    const oyun = Math.floor(Math.random() * cfg.STATUS.length);
    client.user.setActivity({ name: `${cfg.STATUS[oyun]}`, type: ActivityType.Playing });
  }, 10000);
});

//
client.on('presenceUpdate', (oldPresence, newPresence) => {
  // 
  const guild = client.guilds.cache.get(cfg.GUILD_ID);
  const role = guild.roles.cache.get(cfg.ROLE_ID);
  if (!role) {
    console.error('Rol bulunamadı.');
    return;
  }

  const member = guild.members.cache.get(newPresence.userId);
  if (!member) return;

  // 
  const aboutMe = newPresence.activities.find(activity => activity.type === ActivityType.Custom)?.state;
  if (!aboutMe) return;

  // 
  const keywords = cfg.COMMAND_KEYWORDS;
  const hasKeyword = keywords.some(keyword => aboutMe.includes(keyword));

  if (hasKeyword) {
    //
    member.roles.add(role)
      .then(() => console.log(`${member.user.tag} için rol eklendi.`))
      .catch(error => console.error('Rol eklenemedi:', error));
  } else if (member.roles.cache.has(role.id)) {
    //
    member.roles.remove(role)
      .then(() => console.log(`${member.user.tag} için rol kaldırıldı.`))
      .catch(error => console.error('Rol kaldırılamadı:', error));
  }
});

client.login(cfg.TOKEN); // made by marcell.xd alın yengenın hayrına kullanın ıtler sızı
