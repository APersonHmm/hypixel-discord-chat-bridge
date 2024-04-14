module.exports = {
    name: "testCalendar",
    description: "Test command to output the data from getSkyblockCalendar to console for debugging.",
    requiresBot: true,
  
    execute: async (interaction) => {
      const EVENTS = getSkyblockCalendar();
      console.log(EVENTS);
  
      await interaction.reply({ content: 'Calendar data has been logged to the console.' });
    },
  };