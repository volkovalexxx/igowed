import Link from 'next/link'
import Header from '@/components/layout/Header'
import type { HeaderViewer } from '@/components/layout/header.helpers'
import Footer from '@/components/layout/Footer'
import { ProductGallery } from './ProductGallery'
import { buildProductBreadcrumbs, formatProductPrice } from './productCard.format'
import type { ProductCard } from './productCard.types'
import styles from './ProductCardPage.module.css'

export function ProductCardPage({ product, viewer }: { product: ProductCard; viewer?: HeaderViewer | null }) {
  const breadcrumbs = buildProductBreadcrumbs(product)

  return (
    <div className={styles.page}>
      <Header viewer={viewer} />

      <main className={styles.content}>
        <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
          {breadcrumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`}>
              {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
              {index < breadcrumbs.length - 1 ? <i aria-hidden="true">/</i> : null}
            </span>
          ))}
        </nav>

        <div className={styles.layout}>
          <ProductGallery photos={product.photos} title={product.title} />

          <div className={styles.info}>
            <h1>{product.title}</h1>
            <p className={styles.price}>{formatProductPrice(product)}</p>

            {product.description ? <p className={styles.description}>{product.description}</p> : null}

            {product.attributes.length > 0 ? (
              <dl className={styles.attributes}>
                {product.attributes.map((attribute) => (
                  <div className={styles.attributeRow} key={attribute.id}>
                    <dt>{attribute.label}</dt>
                    <dd>{attribute.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className={styles.actions}>
              <Link className={styles.ctaButton} href={`/dashboard/messages?to=${product.vendor.userId}`}>
                {product.ctaLabel}
              </Link>
              <Link className={styles.vendorLink} href={`/vendor/${product.vendor.slug}`}>
                {product.vendor.name}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
