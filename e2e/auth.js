const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const should = chai.should();

chai.use(chaiHttp);

// describe('/GET auth', () => {
// 	it('it should GET a 200 request status and ask for authorization', done => {
// 		chai.request(server)
// 			.get('/auth')
// 			.end((err, res) => {
// 				res.should.have.status(200);
// 				res.body.should.be.eql('Send a post request to this page for authorization');
// 				done();
// 			});
// 	});
// });

let refreshToken;

describe('/POST auth', () => {
	it('it should return refreshToken and accessToken', done => {
		let obj = {
			userName: 'info@nettifixi.fi',
			password: 'salasana'
		};
		chai.request(server)
			.post('/auth')
			.send(obj)
			.end((err, res) => {
				res.should.have.status(200);
				should.exist(res.body);

				res.body.should.have.property('refreshToken');
				res.body.refreshToken.should.be.a('string');
				res.body.refreshToken.should.not.be.empty;

				refreshToken = res.body.refreshToken;

				res.body.should.have.property('accessToken');
				res.body.accessToken.should.be.a('string');
				res.body.accessToken.should.not.be.empty;
				done();
			});
	});
});

describe('/POST auth/refresh', () => {
	it('should generate accessToken', done => {
		chai.request(server)
			.post('/auth/refresh')
			.send({ refreshToken })
			.end((err, res) => {
				res.should.have.status(200);

				res.body.should.have.property('accessToken');
				res.body.accessToken.should.not.be.empty;

				res.body.should.have.property('message');
				res.body.message.should.be.eql('Successfully updated the token');
				done();
			});
	});
});
