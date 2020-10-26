/*
the Swarm object is instantiated with strong defaults
imo the defaults should not presuppose running a blockchain or Bee node locally
this is to ensure easy onboarding for uninitiated devs
running nodes is incentivised by other means
see notes-swarm.js for more details.
*/

let swarm = new Swarm();

/*
the Swarm object then takes on the principal role of creating, uploading and retrieving chunks.
Because the network is now incentivised, this necessarily means that we must also administrate BZZ
therefore basic wallet functionality is included.
*/

let wallet = swarm.wallet();

/*
various types of wallet are catered for, but they have a shared API
to make things easy for web3 developers, a simple in-memory wallet based on a mnemonic will be used.
this is a huge topic with many considerations, see notes-wallet.js for more details
*/

let bzzBalance = wallet.bzzBalance();
let baseBalance = wallet.baseBalance();
let address = swarm.wallet.address();
let address = swarm.wallet.pubKey();
//...

/*
without even connecting to the network, our wallet already have some functionality
*/

let signed = swarm.sign(data);
let address = swarm.recover(data);

/*
once connected, we have could have much more...
*/

let tx1 = wallet.sendBase(recipientAddress, 100);
let tx2 = wallet.sendBzz(recipientAddress, 1000);
//...

/*
our localstorage wallet is based on a root hd mnemonic which is protected by a password
and as kept out of memory as much as possible
this means we can generate many addresses
for now we will have a password supported backup command that protects the root mnemonic
and use an account derived from that to sign transactions that is retained in localhost
if that account is perceived compromised then we can iterated to the next account in the mnemonic and transfer funds
there are more intricate schemes for this and it would bear some refinement - see 'waterfall passwords'.
*/

let swarm = new Swarm('password');

let mnemonic = swarm.wallet.backup('password');

/*
the core functionality of Swarm.js is to provide facility for users to create, retrieve and pin chunks in the DISC
*/

let chunk = new swarm.chunk(binary);
chunk.upload();

let chunk = swarm.chunk.at(reference);
chunk.download();

/*
as well as normal content addressed chunks, we provide facilities to generate SOC's
this is where a lot of the power of Swarm.js lies. 
SOC's are an incredibly powerful tool for app development and a lot of applications
can be entirely powered by create schemes based around SOC's.
*/

let soc = new swarm.SOC('topic');

/*
these SOC's can be thought of by Dapp developers at a very basic level as a mutable key-value store
*/

soc.set('some-key','value');
soc.set('some-key','new value');

soc.get('some-key'); // 'new value'

/*
but there is a powerful api underlying this that gives access to
a myriad of intracacies and special abilities.
*/

soc.prev().get('some-key'); // 'value'

soc.collection('some-key').history();

{
	salt: "ab2e...", //default salt is always a value generated deterministically from the wallet private key, see 'codename siana' for details
	index: "last", //a timeseries is the best way to determine the last value created
	pin: "always", //it is also possible to only pin the latest chunk to save money if old values are not required
	chunks: { //this is the history of all chunks
		{
			address: "",
			topic: "",
			identifier: "",
			mimeType: "string",
			payload: "value",//in some cases chunks will not yet be cached locally
			state: "sent",
			pinnedTTL: ""
		},
		{
			address: "",
			topic: "",
			identifier: "",
			mimeType: "string",
			payload: "" //in some cases chunks will only exist in theory
			state: "sent",
			pinnedTTL: ""
		}
	}
}

/*
as well as the usual timeseries feeds, it is also possible to work
with integer indexed collections
*/

let soc = new swarm.SOC('topic', {
	index: 'integer',
	salt: 'some-magic-salt',
	encryption: 'none'
});

soc.create(0, 'hello world');
soc.create(1, 'welcome to the swarm');

/*
this leads to interesting possibilites, as we can be very specific about 
the location that the chunks fall in the network
the outcome of this is that application developer can build their
data chunk schemes in a way that allows user to predict the exact location
of each other's chunks
*/
let chunkOwnerAddress = 'abc123...';
let anotherBee = new Swarm();
let socReader = new anotherBee.SOC('topic', {
	owner: chunkOwnerAddress,
	index: 'integer',
	salt: 'some-magic-salt'
});

socReader.at(0).download(); // 'hello world'
socReader.at(1).download(); // 'welcome to the swarm'

/*
so far we only used simple text strings as our payload
but Swarm.js is clever enough to be able to recognise different
data and process it accordingly
there is also a pluggable architecture to design your own chunk series types
*/

let soc = new swarm.SOC('my-pics', {
	index: 'integer'
});

//pic1, ... could be browser File objects for example...

soc.create(0,pic1);
soc.create(1,pic2);
soc.create(2,pic3);

soc.get('my-pics');

{
	index: "integer",
	pin: "always", //it is also possible to only pin the latest chunk
	chunks: {
		{
			address: "",
			topic: "",
			identifier: 0,
			mimeType: "image/png",
			payload: File('pic1.png'),
			state: "stored"
		},
		{
			address: "",
			topic: "",
			identifier: 1,
			mimeType: "image/png",
			payload: File('pic2.png'),
			state: "stored"
		},
		{
			address: "",
			topic: "",
			identifier: 2,
			mimeType: "image/png",
			payload: File('pic3.png'),
			state: "stored"
		}
	}
}

/*
power users who want to define their own chunks which are not part of
a supported series can simply specify the exact identifier
*/

let soc = new swarm.SOC('my-pics', {
	id: 0
});


/*
eagle eyed observers will have noticed a reference to encryption
when defining a single owner collection above
because all data is public in swarm, Swarm.js defaults to using encryption schemes
*/


