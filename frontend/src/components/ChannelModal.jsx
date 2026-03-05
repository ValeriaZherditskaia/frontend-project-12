import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Formik, Field, ErrorMessage, Form as FormikForm } from 'formik';
import * as yup from 'yup';
import { closeModal, createChannel, renameChannel, deleteChannel, clearError } from '../slices/channelsSlice.js';

const CHANNEL_SCHEMA = yup.object({
  name: yup.string()
    .trim('Имя не может быть пустым')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .matches(/^[a-zA-Zа-яёА-ЯЁ0-9\s\-_]+$/, 'Только буквы, цифры, пробелы, дефис, подчёркивание')
    .required('Название обязательно'),
});

function ChannelModal() {
  const dispatch = useDispatch();
  const { 
    modal: { type, channelId, isOpen }, 
    error, 
    loading,
    entities: channels 
  } = useSelector((state) => state.channels);

  const currentChannel = channels.find((c) => c.id === channelId);

  // Форма для add/rename
  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (type === 'add') {
        await dispatch(createChannel(values.name)).unwrap();
      } else if (type === 'rename') {
        await dispatch(renameChannel({ id: channelId, name: values.name })).unwrap();
      }
      resetForm();
    } catch (submitError) {
      console.error('Form submit error:', submitError);
    } finally {
      setSubmitting(false);
    }
  };

  // Удаление канала
  const handleDelete = async () => {
    try {
      await dispatch(deleteChannel(channelId)).unwrap();
    } catch (deleteError) {
      console.error('Delete error:', deleteError);
    }
  };

  // Заголовки модалок
  const modalTitles = {
    add: 'Добавить канал',
    remove: `Удалить #${currentChannel?.name || ''}?`,
    rename: `Переименовать #${currentChannel?.name || ''}`,
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onHide={() => dispatch(closeModal())} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{modalTitles[type]}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert 
            variant="danger" 
            dismissible 
            onClose={() => dispatch(clearError())}
          >
            {error}
          </Alert>
        )}

        {type === 'remove' ? (
          <>
            <p className="mb-3">
              Подтвердите удаление канала <strong>#{currentChannel?.name}</strong>.
            </p>
            <p className="text-muted small mb-0">
              Все сообщения будут удалены.
            </p>
          </>
        ) : (
          <Formik
            initialValues={{ name: currentChannel?.name || '' }}
            validationSchema={CHANNEL_SCHEMA}
            onSubmit={handleFormSubmit}
            validateOnMount
            enableReinitialize  // Обновление при смене канала
          >
            {({ isSubmitting, handleSubmit, errors }) => (
              <FormikForm noValidate className="needs-validation">
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="channelName">Название канала</Form.Label>
                  <Field
                    id="channelName"
                    name="name"
                    as={Form.Control}
                    autoFocus
                    disabled={loading || isSubmitting}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  <ErrorMessage 
                    name="name" 
                    component="div" 
                    id="name-error"
                    className="invalid-feedback d-block"
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button 
                    variant="secondary"
                    onClick={() => dispatch(closeModal())}
                    disabled={loading}
                  >
                    Отмена
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isSubmitting || loading || !handleSubmit}
                  >
                    {loading ? 'Сохранение...' : type === 'add' ? 'Добавить' : 'Сохранить'}
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        )}
      </Modal.Body>

      {type === 'remove' && (
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => dispatch(closeModal())}
            disabled={loading}
          >
            Отмена
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Удаление...' : 'Удалить'}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default ChannelModal;
