import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100">
      <h1 className="display-1 fw-bold text-secondary">404</h1>
      <p className="text-muted fs-5">{t('notFound.message')}</p>
      <Link to="/" className="btn btn-primary">
        {t('notFound.home')}
      </Link>
    </div>
  );
}

export default NotFoundPage;