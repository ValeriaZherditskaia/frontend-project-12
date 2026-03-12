// Форма переименования

import { Form, FormControl } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm } from 'formik';
import Profanity from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CHANNEL_SCHEMA } from '../../slices/validationSchemas.js';
import ModalButtons from './ModalButtons.jsx';

const RenameChannelForm = ({ channel, onSubmit, onCancel, isLoading }) => {
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels.entities);
  const existingNames = channels
    .filter(c => c.id !== channel?.id)
    .map(c => c.name);

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    const name = values.name.trim();

    if (!name) {
      setFieldError('name', t('validation.required', 'Обязательное поле'));
      setSubmitting(false);
      return;
    }

    if (existingNames.includes(name)) {
      setFieldError('name', t('modals.unique', 'Должно быть уникальным'));
      setSubmitting(false);
      return;
    }

    if (Profanity.check(name)) {
      setFieldError('name', t('notifications.error.profanity'));
      setSubmitting(false);
      return;
    }

    await onSubmit(name);
    resetForm();
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ name: channel?.name || '' }}
      validationSchema={CHANNEL_SCHEMA}
      onSubmit={handleSubmit}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      enableReinitialize
    >
      {({ isSubmitting, errors, handleSubmit: formikSubmit }) => (
        <FormikForm noValidate onSubmit={formikSubmit}>
          <Form.Group className="mb-3">
            <Field
              id="channelName"
              name="name"
              as={Form.Control}
              autoFocus
              disabled={isLoading || isSubmitting}
              placeholder={t('modals.channelNamePlaceholder', 'Имя канала')}
              isInvalid={errors.name}
            />
            {errors.name && (
              <Form.Control.Feedback type="invalid" className="d-block">
                {errors.name}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <ModalButtons
            onCancel={onCancel}
            onConfirm={formikSubmit}  // ← передаём функцию отправки формы
            confirmText={t('modals.save')}
            isLoading={isLoading || isSubmitting}
          />
        </FormikForm>
      )}
    </Formik>
  );
};

export default RenameChannelForm;