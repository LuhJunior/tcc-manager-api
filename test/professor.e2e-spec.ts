import * as request from 'supertest';
import * as faker from 'faker';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ProfessorModule } from '../src/app/professor/professor.module';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('professor.e2e.spec.ts', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = (
      await Test.createTestingModule({
        imports: [ProfessorModule],
      })
      .compile()
    ).createNestApplication()
      .useGlobalPipes(new ValidationPipe({
        transform: true,
      }));

    prisma.$executeRaw('DELETE FROM professor');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST professor', () => {
    describe('Professor Advisor', () => {
      it('Should create an advisor professor', async () => {
        const professor = {
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
        };

        const res = await request(app.getHttpServer())
          .post('/professor/advisor')
          .send(professor);

        expect(res.status).toBe(201);
        expect(res.body).toEqual(expect.objectContaining(professor));
      });

      it('Should create an advisor professor from a tcc professor', async () => {
        const professor = (await request(app.getHttpServer())
          .post('/professor/tcc')
          .send({
            name: faker.name.findName(),
            email: faker.internet.email(),
            enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
            phoneNumber: faker.phone.phoneNumber('(##)#####-####')
          })).body;

        const res = await request(app.getHttpServer())
          .post('/professor/advisor')
          .send({ professorId: professor.id});

        expect(res.status).toBe(201);
        expect(res.body).toEqual(expect.objectContaining(professor));
      });

      it('If name is not a string, should return a status 400', async () => {
        const res = await request(app.getHttpServer())
          .post('/professor/advisor')
          .send({
            name: faker.datatype.number(),
            email: faker.internet.email(),
            enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
            phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
          });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'name must be a string'
          ],
          error: 'Bad Request'
        });
      });

      it('If the body request is empty, should return a status 400', async () => {
        const res = await request(app.getHttpServer())
          .post('/professor/advisor')
          .send({ });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'name must be a string',
            'name should not be empty',
            'email must be an email',
            'email must be a string',
            'email should not be empty',
            'enrollmentCode must be shorter than or equal to 15 characters',
            'enrollmentCode must be a number string',
            'enrollmentCode must be a string',
            'enrollmentCode should not be empty',
            'phoneNumber must be shorter than or equal to 15 characters',
            'phoneNumber must be a string',
            'phoneNumber should not be empty',
          ],
          error: 'Bad Request'
        });
      });

      it('If the professor with given id not exist, should return a 404 status', async () => {
        const res = await request(app.getHttpServer())
          .post('/professor/advisor')
          .send({ professorId: faker.datatype.uuid() });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
          statusCode: 404,
          message: 'Professor not found.'
        });
      });
    });

    describe('Professor TCC', () => {
      it('Should create a TCC professor', async () => {
        const professor = {
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
        };

        const res = await request(app.getHttpServer())
          .post('/professor/tcc')
          .send(professor);

        expect(res.status).toBe(201);
        expect(res.body).toEqual(expect.objectContaining(professor));
      });

      it('Should create a TCC professor from an advisor professor', async () => {
        const professor = (await request(app.getHttpServer())
          .post('/professor/advisor')
          .send({
            name: faker.name.findName(),
            email: faker.internet.email(),
            enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
            phoneNumber: faker.phone.phoneNumber('(##)#####-####')
          })).body;

        const res = await request(app.getHttpServer())
          .post('/professor/tcc')
          .send({ professorId: professor.id});

        expect(res.status).toBe(201);
        expect(res.body).toEqual(expect.objectContaining(professor));
      });

      it('If name is not a string, should return a status 400', async () => {
        const res = await request(app.getHttpServer())
          .post('/professor/tcc')
          .send({
            name: faker.datatype.number(),
            email: faker.internet.email(),
            enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
            phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
          });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'name must be a string'
          ],
          error: 'Bad Request'
        });
      });

      it('If the body request is empty, should return a status 400', async () => {
        const res = await request(app.getHttpServer())
          .post('/professor/tcc')
          .send({ });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'name must be a string',
            'name should not be empty',
            'email must be an email',
            'email must be a string',
            'email should not be empty',
            'enrollmentCode must be shorter than or equal to 15 characters',
            'enrollmentCode must be a number string',
            'enrollmentCode must be a string',
            'enrollmentCode should not be empty',
            'phoneNumber must be shorter than or equal to 15 characters',
            'phoneNumber must be a string',
            'phoneNumber should not be empty',
          ],
          error: 'Bad Request'
        });
      });

      it('If the professor with given id not exist, should return a 404 status', async () => {
        const res = await request(app.getHttpServer())
          .post('/professor/tcc')
          .send({ professorId: faker.datatype.uuid() });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
          statusCode: 404,
          message: 'Professor not found.'
        });
      });
    });

  });

  describe('/GET professor/:id', () => {
    it('Should return an advisor professor', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/advisor')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
        })).body;

      const res = await request(app.getHttpServer())
        .get(`/professor/${professor.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(professor));
    });

    it('Should return a TCC professor', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/tcc')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
        })).body;

      const res = await request(app.getHttpServer())
        .get(`/professor/${professor.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(res.body));
    });

    it('If param id is not an uuid, should return a 400 status', async () => {
      const res = await request(app.getHttpServer())
        .get(`/professor/${faker.datatype.number()}`);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ statusCode: 400, message: ['id must be a UUID'], error: 'Bad Request' });
    });

    it('If the professor with given id not exist, should return a 404 status', async () => {
      const res = await request(app.getHttpServer())
        .get(`/professor/${faker.datatype.uuid()}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ statusCode: 404, message: 'Professor not found.' });
    });
  });

  describe('/GET professor/enrollmentCode/:enrollmentCode', () => {
    it('Should return an advisor professor', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/advisor')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
        })).body;

      const res = await request(app.getHttpServer())
        .get(`/professor/enrollmentCode/${professor.enrollmentCode}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(professor));
    });

    it('Should return a TCC professor', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/tcc')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
        })).body;

      const res = await request(app.getHttpServer())
        .get(`/professor/enrollmentCode/${professor.enrollmentCode}`);

      expect(res.body).toEqual(expect.objectContaining(res.body));
    });

    it('If param enrollmentCode is not an alphaNumeric, should return a 400 status', async () => {
      const res = await request(app.getHttpServer())
        .get(`/professor/enrollmentCode/${faker.random.alpha({ count: 10 })}`);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ statusCode: 400, message: ['enrollmentCode must be a number string'], error: 'Bad Request' });
    });

    it('If the professor with given id not exist, should return a 404 status', async () => {
      const res = await request(app.getHttpServer())
        .get(`/professor/enrollmentCode/${faker.datatype.number({ min: 10000000000 }).toString()}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ statusCode: 404, message: 'Professor not found.' });
    });
  });

  describe('/GET professor', () => {
    it('Should return all professors', async () => {
      const professors = await Promise.all(
        Array(faker.datatype.number({ min: 0, max: 10 }))
          .fill(null)
          .map(async () => (
            (await request(app.getHttpServer())
              .post('/professor/advisor')
              .send({
                name: faker.name.findName(),
                email: faker.internet.email(),
                enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
                phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
              })).body
            )
          )
        );

      const res = await request(app.getHttpServer()).get('/professor');

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(professors.length);
      expect(res.body).toEqual(expect.arrayContaining(professors.map(professor => expect.objectContaining(professor))));
    });

    it('Should skip 1 and take 3 professors', async () => {
      await Promise.all(
        Array(faker.datatype.number({ min: 5, max: 10 }))
          .fill(null)
          .map(async () => (
            (await request(app.getHttpServer())
              .post('/professor/tcc')
              .send({
                name: faker.name.findName(),
                email: faker.internet.email(),
                enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
                phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
              })).body
            )
          )
        );

      const res = await request(app.getHttpServer()).get('/professor').query({ skip: 1, take: 3 });

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('/PATCH professor', () => {
    it('Should update a professor', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/advisor')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####')
        })).body;

      const uProfessor = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
        phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
      };

      const res = await request(app.getHttpServer())
        .patch(`/professor/${professor.id}`)
        .send(uProfessor);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(uProfessor));
    });

    it('If name is not a string, should return a status 400', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/advisor')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####')
        })).body;

      const uProfessor = {
        name: faker.datatype.number(),
        email: faker.internet.email(),
        enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
        phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
      };

      const res = await request(app.getHttpServer())
        .patch(`/professor/${professor.id}`)
        .send(uProfessor);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'name must be a string'
        ],
        error: 'Bad Request'
      });
    });

    it('If the professor with given id not exist, should return a 404 status', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/professor/${faker.datatype.uuid()}`)
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
        });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: 'Professor not found.'
      });
    });
  });

  describe('/DELETE professor', () => {
    it('Should delete a professor', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/tcc')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
        })).body;

      const res = await request(app.getHttpServer())
        .delete(`/professor/${professor.id}`);

      delete professor.deletedAt;
      delete professor.updatedAt;
      expect(res.body).toEqual(expect.objectContaining(professor));
      expect((await request(app.getHttpServer()).get(`/professor/${professor.id}`)).body).toEqual({ statusCode: 404, message: 'Professor not found.' });
    });

    it('If param id is not an uuid, should return a 400 status', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/professor/${faker.random.alphaNumeric(10)}`);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ statusCode: 400, message: ['id must be a UUID'], error: 'Bad Request' });
    });

    it('If the professor with given id not exist, should return a 404 status', async () => {
      const res = await request(app.getHttpServer()).delete(`/professor/${faker.datatype.uuid()}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ statusCode: 404, message: 'Professor not found.' });
    });
  });
});
