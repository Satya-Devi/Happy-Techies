import styles from './BlogContainer.module.css';

type Props = {
    children: string | JSX.Element | JSX.Element[] 
}
  
export const BlogContainer = ({children}:Props) => {
    return (
        <div className={styles.blog_detail_section}>
            {children}
        </div>
    );
}