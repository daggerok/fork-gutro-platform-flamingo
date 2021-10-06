import React, { useState } from 'react';
import {
  Form,
  Button,
  Upload,
  DatePicker,
  Spin,
  message,
} from 'antd';

import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { Store } from 'antd/lib/form/interface';
import { InboxOutlined } from '@ant-design/icons';

import { Role } from '~/types';

import ResultPopup from '~/components/Common/ResultPopup';

import {
  ScheduledPlayer,
  getPlayerListFromFiles,
  isBeforeToday,
} from '~/utils/csv-upload';

import { getTimeZoneOffset } from '~/utils/common';
import { hasRole } from '~/utils/role-check';

import { schedulePromotions } from '~/api/scheduling';

import {
  CSVUploadFormProps,
  ResultPopupData,
} from './types';

import {
  RESULT_POPUP_MESSAGES,
  FORM_LAYOUT,
  FORM_RULES,
} from './constants';

import ConfirmationModal from './ConfirmationModal';
import styles from './CsvUploadForm.module.scss';

const timeZoneOffset = getTimeZoneOffset();

const getResultPopupMessage = (key: string | number): string => {
  switch (key) {
    case 'success':
      return RESULT_POPUP_MESSAGES.success;
    case 'error':
      return RESULT_POPUP_MESSAGES.error;
    default:
      return '';
  }
};

const CSVUploadForm: React.FC<CSVUploadFormProps> = ({ onUpdate }: CSVUploadFormProps) => {
  const [ confirmationModalOpen, setConfirmationModalOpen ] = useState<boolean>(false);
  const [ resultPopup, setResultPopup ] = useState<ResultPopupData | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ schedulingPromotions, setSchedulingPromotions ] = useState<Array<ScheduledPlayer> | null>(null);
  const [ form ] = Form.useForm();

  const hasEditRights = hasRole(Role.PROMOTION_SCHEDULING_WRITE);

  const onFinish = async (values: Store): Promise<void> => {
    if (!values.csvFiles.length || !values.scheduleDate) {
      return;
    }

    setIsLoading(true);

    try {
      const promisedSchedulingPromotions = await getPlayerListFromFiles(values.csvFiles, values.scheduleDate);
      setSchedulingPromotions(promisedSchedulingPromotions);
      setConfirmationModalOpen(true);
    
    } catch (e) {
      message.error(
        <div>
          Error when uploading file:<br />
          {e}
        </div>
      );
    }

    setIsLoading(false);
  };

  const handleConfirmationModalOkClick = (): void => {
    setConfirmationModalOpen(false);
    setIsLoading(true);

    schedulePromotions(schedulingPromotions)
      .then((res) => {
        if (res.data.error) {
          throw new Error(res.data.error);
        }

        setIsLoading(false);
        setResultPopup({ status: 'success' });
        form.resetFields();
        onUpdate();
      })
      .catch((err: Error) => {
        setIsLoading(false);
        setResultPopup({ status: 'error', message: err.message });
      });
  };

  const getFileListFromEvent = (e: UploadChangeParam): Array<UploadFile> => {
    return e && (Array.isArray(e) ? e : e.fileList);
  };

  const mockUploadRequest = ({ onSuccess, file }: any): void => {  //eslint-disable-line @typescript-eslint/no-explicit-any
    setTimeout(() => {
      onSuccess({}, file);
    }, 100);
  };

  return (
    <Spin spinning={isLoading}>
      { resultPopup && (
        <ResultPopup
          status={resultPopup.status}
          title={getResultPopupMessage(resultPopup.status)}
          subTitle={resultPopup.message}
          onOkClick={(): void => setResultPopup(null) }
        />
      )}

      <ConfirmationModal
        open={confirmationModalOpen}
        setOpen={setConfirmationModalOpen}
        schedulingPromotionCount={(schedulingPromotions || []).length}
        onOkClick={handleConfirmationModalOkClick}
      />

      <Form
        {...FORM_LAYOUT}
        form={form}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="csvFiles"
          valuePropName="fileList"
          getValueFromEvent={getFileListFromEvent}
          rules={FORM_RULES.csvFiles}
        >
          <Upload.Dragger
            name="files"
            className={styles.dragger}
            accept=".csv"
            customRequest={mockUploadRequest}
            disabled={!hasEditRights}
          >
            <div className={styles.draggerInnerContainer}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag files to this area to upload</p>
              <p className="ant-upload-hint">You can schedule multiple files at the same time</p>
            </div>
          </Upload.Dragger>
        </Form.Item>


        <Form.Item
          name="scheduleDate"
          rules={FORM_RULES.scheduleDate}
        >
          <DatePicker
            className={styles.datePicker}
            format="YYYY-MM-DD HH:mm"
            placeholder={`Schedule date (GMT${timeZoneOffset})`}
            showTime={{
              format: 'HH:mm',
              minuteStep: 5,
            }}
            disabledDate={isBeforeToday}
            disabled={!hasEditRights}
          />
        </Form.Item>


        <Form.Item className={styles.submitButtonContainer}>
          <Button
            type="primary"
            htmlType="submit"
            style={{width: '100%'}}
            disabled={!hasEditRights}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default CSVUploadForm;
