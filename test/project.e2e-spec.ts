import * as request from 'supertest';
import * as faker from 'faker';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ProfessorModule } from '../src/app/professor/professor.module';
import { ProjectModule } from '../src/app/project/project.module';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('professor.e2e.spec.ts', () => {
  let app: INestApplication;

  beforeAll(async (done) => {
    app = (
      await Test.createTestingModule({
        imports: [ProfessorModule, ProjectModule],
      })
      .compile()
    ).createNestApplication()
      .useGlobalPipes(new ValidationPipe({
        transform: true,
      }));

    prisma.$executeRaw('DELETE FROM project');
    prisma.$executeRaw('DELETE FROM professor');

    await app.init();
    done();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST project', () => {
    it('Should create an advisor professor', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/advisor')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####')
        })).body;

      const project = {
        professorId: professor.id,
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
      };

      const res = await request(app.getHttpServer())
        .post('/project')
        .send(project);

      delete project.professorId;

      expect(res.status).toBe(201);
      expect(res.body).toEqual(expect.objectContaining(project));
    });

    it('If title is not a string, should return a status 400', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/advisor')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####')
        })).body;

      const project = {
        professorId: professor.id,
        title: faker.datatype.number(),
        description: faker.commerce.productDescription(),
      };

      const res = await request(app.getHttpServer())
        .post('/project')
        .send(project);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'title must be a string'
        ],
        error: 'Bad Request'
      });
    });

    it('If the body request is empty, should return a status 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/project')
        .send({ });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: [
          'professorId must be a UUID',
          'professorId must be a string',
          'professorId should not be empty',
          'title must be a string',
          'title should not be empty',
          'description must be a string',
          'description should not be empty',
        ],
        error: 'Bad Request'
      });
    });

    it('If the professor with given id is not an advisor, should return a 400 status', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/tcc')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####')
        })).body;

      const res = await request(app.getHttpServer())
        .post('/project')
        .send({
          professorId: professor.id,
          title: faker.commerce.product(),
          description: faker.commerce.productDescription(),
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Professor is not an advisor.'
      });
    });

    it('If the professor with given id not exist, should return a 404 status', async () => {
      const res = await request(app.getHttpServer())
        .post('/project')
        .send({
          professorId: faker.datatype.uuid(),
          title: faker.commerce.product(),
          description: faker.commerce.productDescription(),
        });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: 'Professor not found.'
      });
    });
  });

  describe('/GET project/:id', () => {
    it('Should return a project', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/advisor')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
        })).body;

      const project = (await request(app.getHttpServer())
        .post('/project')
        .send({
          professorId: professor.id,
          title: faker.commerce.product(),
          description: faker.commerce.productDescription(),
        })).body;

      const res = await request(app.getHttpServer())
        .get(`/project/${project.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(project));
    });

    it('If param id is not an uuid, should return a 400 status', async () => {
      const res = await request(app.getHttpServer())
        .get(`/project/${faker.datatype.number()}`);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ statusCode: 400, message: ['id must be a UUID'], error: 'Bad Request' });
    });

    it('If the project with given id not exist, should return a 404 status', async () => {
      const res = await request(app.getHttpServer())
        .get(`/project/${faker.datatype.uuid()}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ statusCode: 404, message: 'Project not found.' });
    });
  });

  describe('/GET project/professor/:id', () => {
    it('Should return advisor professor\'s projects', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/advisor')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
        })).body;

      const projects = await Promise.all(
        Array(faker.datatype.number({ min: 0, max: 10 }))
          .fill(null)
          .map(async () => (
            (await request(app.getHttpServer())
              .post('/project')
              .send({
                professorId: professor.id,
                title: faker.commerce.product(),
                description: faker.commerce.productDescription(),
                files: [
                  {
                    title: faker.commerce.productAdjective(),
                    description: faker.commerce.productDescription(),
                    fileUrl: faker.internet.url(),
                  },
                ],
              })).body
            )
          )
        );

      const res = await request(app.getHttpServer())
        .get(`/project/professor/${professor.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining(projects.map(project => expect.objectContaining(project))));
    });
  });

  describe('/GET projects', () => {
    it('Should return all projects', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/advisor')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
        })).body;

      const projects = await Promise.all(
        Array(faker.datatype.number({ min: 0, max: 10 }))
          .fill(null)
          .map(async () => (
            (await request(app.getHttpServer())
              .post('/project')
              .send({
                professorId: professor.id,
                title: faker.commerce.product(),
                description: faker.commerce.productDescription(),
                files: [
                  {
                    title: faker.commerce.productAdjective(),
                    description: faker.commerce.productDescription(),
                    fileUrl: faker.internet.url(),
                  },
                ],
              })).body
            )
          )
        );

      const res = await request(app.getHttpServer()).get('/project');

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(projects.length);
      expect(res.body).toEqual(expect.arrayContaining(projects.map(project => expect.objectContaining(project))));
    });

    it('Should skip 1 and take 4 projects', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/advisor')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
        })).body;

      await Promise.all(
        Array(faker.datatype.number({ min: 0, max: 10 }))
          .fill(null)
          .map(async () => (
            (await request(app.getHttpServer())
              .post('/project')
              .send({
                professorId: professor.id,
                title: faker.commerce.product(),
                description: faker.commerce.productDescription(),
                files: [
                  {
                    title: faker.commerce.productAdjective(),
                    description: faker.commerce.productDescription(),
                    fileUrl: faker.internet.url(),
                  },
                ],
              })).body
            )
          )
        );

      const res = await request(app.getHttpServer()).get('/project').query({ skip: 1, take: 4 });

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('/PATCH project', () => {
    describe('/project/:id', () => {
      it('Should update a professor', async () => {
        const professor = (await request(app.getHttpServer())
          .post('/professor/advisor')
          .send({
            name: faker.name.findName(),
            email: faker.internet.email(),
            enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
            phoneNumber: faker.phone.phoneNumber('(##)#####-####')
          })).body;

        const project = (await request(app.getHttpServer())
          .post('/project')
          .send({
            professorId: professor.id,
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
          })).body;

        const uProject = {
          title: faker.commerce.product(),
          description: faker.commerce.productDescription(),
        };

        const res = await request(app.getHttpServer())
          .patch(`/project/${project.id}`)
          .send(uProject);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining(uProject));
      });

      it('If title is not a string, should return a status 400', async () => {
        const professor = (await request(app.getHttpServer())
          .post('/professor/advisor')
          .send({
            name: faker.name.findName(),
            email: faker.internet.email(),
            enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
            phoneNumber: faker.phone.phoneNumber('(##)#####-####')
          })).body;

        const project = (await request(app.getHttpServer())
          .post('/project')
          .send({
            professorId: professor.id,
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
          })).body;

        const uProject = {
          title: faker.datatype.number(),
          description: faker.commerce.productDescription(),
        };

        const res = await request(app.getHttpServer())
          .patch(`/project/${project.id}`)
          .send(uProject);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
          statusCode: 400,
          message: [
            'title must be a string'
          ],
          error: 'Bad Request'
        });
      });

      it('If the project with given id not exist, should return a 404 status', async () => {
        const res = await request(app.getHttpServer())
          .patch(`/project/${faker.datatype.uuid()}`)
          .send({
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
          });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
          statusCode: 404,
          message: 'Project not found.'
        });
      });
    });

    describe('/professor/:id/deactivate', () => {
      it('Should update a professor', async () => {
        const professor = (await request(app.getHttpServer())
          .post('/professor/advisor')
          .send({
            name: faker.name.findName(),
            email: faker.internet.email(),
            enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
            phoneNumber: faker.phone.phoneNumber('(##)#####-####')
          })).body;

        const project = (await request(app.getHttpServer())
          .post('/project')
          .send({
            professorId: professor.id,
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
          })).body;

        const res = await request(app.getHttpServer())
          .patch(`/project/${project.id}/deactivate`)
          .send();

        expect(res.status).toBe(200);
        expect(res.body.status).toEqual('DISABLED');
      });

      it('If the project with given id not exist, should return a 404 status', async () => {
        const res = await request(app.getHttpServer())
          .patch(`/project/${faker.datatype.uuid()}/deactivate`)
          .send();

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
          statusCode: 404,
          message: 'Project not found.'
        });
      });
    });
  });

  describe('/DELETE project', () => {
    it('Should delete a project', async () => {
      const professor = (await request(app.getHttpServer())
        .post('/professor/advisor')
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          enrollmentCode: faker.datatype.number({ min: 10000000000 }).toString(),
          phoneNumber: faker.phone.phoneNumber('(##)#####-####'),
        })).body;

      const project = (await request(app.getHttpServer())
        .post('/project')
        .send({
          professorId: professor.id,
          title: faker.commerce.product(),
          description: faker.commerce.productDescription(),
        })).body;

      const res = await request(app.getHttpServer())
        .delete(`/project/${project.id}`);

      delete project.deletedAt;
      delete project.updatedAt;
      expect(res.body).toEqual(expect.objectContaining(project));
      expect((await request(app.getHttpServer()).get(`/project/${project.id}`)).body).toEqual({ statusCode: 404, message: 'Project not found.' });
    });

    it('If param id is not an uuid, should return a 400 status', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/project/${faker.random.alphaNumeric(10)}`);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ statusCode: 400, message: ['id must be a UUID'], error: 'Bad Request' });
    });

    it('If the project with given id not exist, should return a 404 status', async () => {
      const res = await request(app.getHttpServer()).delete(`/project/${faker.datatype.uuid()}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ statusCode: 404, message: 'Project not found.' });
    });
  });
});
