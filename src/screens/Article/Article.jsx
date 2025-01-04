
import { useEffect, useState } from "react";

import './Article.css';
import { Modal } from '../../components/Modal/Modal'
import { Loader } from '../../components/Loader/Loader'
import { NotionBlock } from "../../components/NotionBlock/NotionBlock";
import { fetchArticle } from '../../api/fetchArticle';
import { transformBlocks } from "../../utils/notion";

export const Article = ({ article, isModalOpen, onCloseModal }) => {
    const params = new URLSearchParams(window.location.search);
    const postURL = params.get("post");

    const [ blocks, setBlocks ] = useState('')
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
        const articleId = article?.id || postURL
        if (!articleId) return
        setIsLoading(true);

        fetchArticle(articleId).then((data) => {
            if (data) {
                setBlocks(data);
            }
        }).finally(() => {
            setIsLoading(false);
        });;
    }, [ article?.id ]);

    if (!blocks) return

    const processedBlocks = transformBlocks(blocks);

    return (
        <Modal key={article?.id} isOpen={isModalOpen} onClose={onCloseModal}>
            {isLoading ?
                <div className="loading-wrapper"><Loader /></div>
                :
                <div className="article-wrapper">
                    <h1>{article?.title}</h1>
                    <p className="subtitle">{article?.subtitle}</p>
                    {processedBlocks?.map((block) => <NotionBlock {...block} />)}
                </div>}
        </Modal>

    )
}