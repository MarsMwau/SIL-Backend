const transformPhoto = (photo) => {
    return {
        id: photo._id,
        albumId: photo.albumId,
        title: photo.title,
        imageUrl: photo.imageUrl,
    };
};

const transformAlbum = (album) => {
    return {
        id: album._id,
        userId: album.userId,
        title: album.title,
        photos: album.photos.map(transformPhoto),
    };
};

const transformUser = (user) => {
    return {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        albums: user.albums.map(transformAlbum),
    };
};

module.exports = {
    transformPhoto,
    transformAlbum,
    transformUser,
};
