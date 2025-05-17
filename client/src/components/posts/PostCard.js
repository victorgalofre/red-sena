import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Avatar,
    IconButton,
    Button,
    Box,
    Alert,
    Collapse,
    Divider,
} from '@mui/material';
import {
    ThumbUp as LikeIcon,
    ThumbUpOutlined as LikeOutlinedIcon,
    Chat as CommentIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import axios from 'axios';
import CommentForm from './CommentForm';
import CommentCard from './CommentCard';

const PostCard = ({ post }) => {
    const { user } = useAuth();
    const [likes, setLikes] = useState(post.likes);
    const [liked, setLiked] = useState(post.hasLiked(user?._id));
    const [error, setError] = useState('');

    const handleLike = async () => {
        try {
            if (liked) {
                await axios.delete(`/api/posts/${post._id}/like`);
                setLikes(likes.filter(id => id.toString() !== user._id.toString()));
            } else {
                await axios.post(`/api/posts/${post._id}/like`);
                setLikes([...likes, user._id]);
            }
            setLiked(!liked);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al dar like');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/posts/${post._id}`);
            // Aquí podrías redirigir o actualizar la lista de posts
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar el post');
        }
    };

    const [showComments, setShowComments] = useState(false);
    const [expanded, setExpanded] = useState(false);

    return (
        <Card sx={{ mb: 2 }}>
            {error && (
                <Alert severity="error" sx={{ m: 2 }}>
                    {error}
                </Alert>
            )}
            
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        src={post.usuario.fotoPerfil}
                        sx={{ mr: 2 }}
                    />
                    <Box>
                        <Typography variant="h6">
                            {post.usuario.nombre} {post.usuario.apellido}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(post.fechaPublicacion).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    {post.contenido}
                </Typography>

                {post.imagen && (
                    <img
                        src={post.imagen}
                        alt="Post"
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '4px',
                            objectFit: 'cover',
                        }}
                    />
                )}
            </CardContent>

            <CardActions disableSpacing>
                <IconButton onClick={handleLike}>
                    {liked ? (
                        <LikeIcon color="primary" />
                    ) : (
                        <LikeOutlinedIcon />
                    )}
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                    {likes.length}
                </Typography>
                <IconButton onClick={() => setShowComments(!showComments)}>
                    <CommentIcon />
                </IconButton>
                {post.usuario._id.toString() === user?._id.toString() && (
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon color="error" />
                    </IconButton>
                )}
                <IconButton onClick={() => setExpanded(!expanded)}>
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </CardActions>

            <Collapse in={showComments} timeout="auto" unmountOnExit>
                <Divider />
                <CardContent>
                    <CommentForm postId={post._id} />
                    {post.comentarios.map((comment) => (
                        <CommentCard
                            key={comment._id}
                            comment={comment}
                            postId={post._id}
                        />
                    ))}
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default PostCard;
