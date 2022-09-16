import { JOB_REF, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';

@Processor('app')
export class WorkerConsumer {
  constructor(@Inject(JOB_REF) jobRef: Job) {
    console.log(jobRef);
  }

  // @Process('job1')
  // async runJob1(job: Job<unknown>) {
  //   let progress = 0;
  //   for (i = 0; i < 100; i++) {
  //     await doSomething(job.data);
  //     progress += 1;
  //     await job.progress(progress);
  //   }
  //   return {};
  // }
}
