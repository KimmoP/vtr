Meteor.methods({
  emailVtr: function (vtrId, operation) {
    newVtrDoc = Vtr.findOne(vtrId);
    console.log('Starting to send email on vtr ' + newVtrDoc._id + ' user ' + this.userId + ' type ' + operation);
    console.log('Whole document: ' + JSON.stringify(newVtrDoc));
    if (operation==='update') { 
        var emailSubject = 'Vaaratilanneilmoitusta muokattu - ' + newVtrDoc.subject;
        var emailBody = 'Vaaratilanneilmoitusta on muokattu.';
        var changes = Vtrchanges.find({vtr: vtrId}).fetch();
    }
    else {
        var emailSubject = 'Uusi vaaratilanneilmoitus tehty - ' + newVtrDoc.subject;
        var emailBody = 'Uusi vaaratilanneilmoitus on tehty.';
    };
    useremail =  Meteor.users.findOne(this.userId).emails[0].address;
    console.log('Added user email ' + useremail + ' as recipient of email');
    var ccs = [];
    if(typeof changes !== "undefined")
            {
              changes = JSON.stringify(changes, true, 2);
            }
      else
            {
              changes = '';
            }
    ccs.push(Dropzones.findOne(newVtrDoc.happenedDz).headOfTraining);
    ccs.push(Dropzones.findOne(newVtrDoc.happenedDz).headOfSafety);
    ccs.push(Dropzones.findOne(newVtrDoc.happenedDz).viceHeadOfTraining);
    ccs.push(adminemails);
    console.log('Added ' + ccs.join(",") + ' as carbon copies');
    this.unblock();
    Email.send({
      from: "Vaaratilanneilmoitus <vtr@laskuvarjotoimikunta.fi>",
      to: "Vaaratilanneilmoitus <vtr@laskuvarjotoimikunta.fi>",
      bcc: useremail,
      cc: ccs.join(","),
      subject: emailSubject,
      text: emailBody + 
            "\n\n" +
            "Ilmoitus nähtävissä (kirjautumisen jälkeen) osoitteessa " + Meteor.absoluteUrl() + 'vtr/' + newVtrDoc._id + "\n\n" +
            changes
    });
    console.log('Email sent.');
    return true;
  }
});