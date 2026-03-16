import { Form } from 'react-bootstrap'
import { Formik, Field, Form as FormikForm } from 'formik'
import Profanity from 'leo-profanity'
import { useTranslation } from 'react-i18next'
import { useGetChannelsQuery } from '../../services/api'
import { CHANNEL_SCHEMA } from '../../slices/validationSchemas.js'
import ModalButtons from './ModalButtons.jsx'

const AddChannelForm = ({ onSubmit, onCancel, isLoading }) => {
  const { t } = useTranslation()
  const { data: channels = [] } = useGetChannelsQuery()
  const existingNames = channels.map(c => c.name)

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    const rawName = values.name.trim()

    if (!rawName) {
      setFieldError('name', t('validation.required'))
      setSubmitting(false)
      return
    }

    if (existingNames.includes(rawName)) {
      setFieldError('name', t('modals.unique'))
      setSubmitting(false)
      return
    }

    const cleanedName = Profanity.clean(rawName)

    await onSubmit(cleanedName)
    resetForm()
    setSubmitting(false)
  }

  return (
    <Formik
      initialValues={{ name: '' }}
      validationSchema={CHANNEL_SCHEMA}
      onSubmit={handleSubmit}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
    >
      {({ isSubmitting, errors, handleSubmit: formikSubmit }) => (
        <FormikForm noValidate onSubmit={formikSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="channelName">
              {t('modals.channelNamePlaceholder')}
            </Form.Label>
            <Field
              id="channelName"
              name="name"
              as={Form.Control}
              autoFocus
              disabled={isLoading || isSubmitting}
              placeholder={t('modals.channelNamePlaceholder')}
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
            onConfirm={formikSubmit}
            confirmText={t('modals.add')}
            isLoading={isLoading || isSubmitting}
          />
        </FormikForm>
      )}
    </Formik>
  )
}

export default AddChannelForm