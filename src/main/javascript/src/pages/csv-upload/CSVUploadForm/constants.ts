import { Rule } from 'antd/lib/form';
import { UploadFile } from 'antd/lib/upload/interface';

export const FORM_LAYOUT = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 24,
  },
};

export const RESULT_POPUP_MESSAGES = {
  success: 'Successfully scheduled promotions!',
  error: 'Oops, something bad happened!',
};

export const FORM_RULES = {
  csvFiles: [
    { required: true, message: 'Please upload at least one file' },
    {
      validator: (rule: Rule, value: Array<UploadFile>): Promise<void> => {
        const fileNames = value.map(it => it.name);
        const uniqueFileNames = new Set(fileNames);

        if (uniqueFileNames.size !== fileNames.length) {
          return Promise.reject('You can\'t upload the same file multiple times.');
        }
        return Promise.resolve();
      },
    },
  ],
  scheduleDate: [
    { required: true, message: 'Please select a schedule date' },
  ],
};
