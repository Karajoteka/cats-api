const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('error');

async function loadRandomMichis() {
  const res = await fetch(API_URL_RANDOM);
  const data = await res.json();
  console.log('Random');
  console.log(data); 

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    
    img1.src = data[0].url;
    img2.src = data[1].url;

    btn1.onclick = () => saveFavouriteMichi(data[0].id);
    btn2.onclick = () => saveFavouriteMichi(data[1].id);
  }
}

async function loadFavouriteMichis() {
  const res = await fetch(API_URL_FAVORITES, {
    method: 'GET',
    headers: {
      'X-API-KEY': 'live_I3MTEobcZ7VA7v90Pp6mENwT0UgddpfPeYn3bE0mHc6llTAKRxBhwPQxJIe2kylb',
    },
  });
  const data = await res.json();
  console.log('Favoritos');
  console.log(data);

  if (res.status !== 200) {
    spanError.innerHTML = 'Hubo un error: ' + res.status + data.message;
  } else {
    const section = document.getElementById('favouriteMichis');
    section.innerHTML = '';

    data.forEach(michi => {      
      const article = document.createElement('article');
      const img = document.createElement('img');
      const button = document.createElement('button');
      const buttonText = document.createTextNode('');
      const buttonImg = document.createElement('img');

      img.style.borderRadius = '10px';
      img.onmouseover = () => {
        img.style.border = '3px solid #00ADB5';
      };
      img.onmouseout = () => {
        img.style.border = 'none';
      };

      button.style.position = 'relative';
      button.style.display = 'inline-block';
      button.style.bottom = '50px';
      button.style.right = '-110px';
      button.style.backgroundColor = 'transparent';
      button.style.cursor = 'pointer';
      button.style.transition = 'transform 0.3s ease-in-out';
      button.onmouseover = () => {
        button.style.transform = 'scale(1.1)';
      };
      button.onmouseout = () => {
        button.style.transform = 'scale(1)';
      };
      button.onmousedown = () => {
        button.style.transform = 'scale(0.9)';
      };
      button.onmouseup = () => {
        button.style.transform = 'scale(1)';
      };

      buttonImg.style.width = '40px';
      buttonImg.style.height = '40px';
      buttonImg.style.backgroundImage = 'url(../imgs/delete.png)';
      buttonImg.style.backgroundSize = 'cover';
      buttonImg.style.backgroundPosition = 'center';
      buttonImg.style.backgroundRepeat = 'no-repeat';

      button.appendChild(buttonImg);
      button.appendChild(buttonText);

      article.appendChild(img);
      article.appendChild(button);

      img.src = michi.image.url
      img.width = 300;
      button.appendChild(buttonText);     
      button.onclick = () => deleteFavouriteMichi(michi.id);       
      article.appendChild(img);
      article.appendChild(button);
      section.appendChild(article);
    });
  }
}

async function saveFavouriteMichi(id) {
  const res = await fetch(API_URL_FAVORITES, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': 'live_I3MTEobcZ7VA7v90Pp6mENwT0UgddpfPeYn3bE0mHc6llTAKRxBhwPQxJIe2kylb',
    },
    body: JSON.stringify({
      image_id: id
    }),
  });
  const data = await res.json();

  console.log('save');
  console.log(res);

  if (res.status !== 200) {
    spanError.innerHTML = 'Hubo un error: ' + res.status + data.message;
  } else {
    console.log('Michi guardado en favoritos');
    loadFavouriteMichis();
  }
}

async function deleteFavouriteMichi(id) {
  const res = await fetch(API_URL_FAVORITES_DELETE(id), {
    method: 'DELETE',
    headers: {
      'X-API-KEY': 'live_I3MTEobcZ7VA7v90Pp6mENwT0UgddpfPeYn3bE0mHc6llTAKRxBhwPQxJIe2kylb',
    },
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = 'Hubo un error: ' + res.status + data.message;
  } else {
    console.log('Michi eliminado de favoritos');
    loadFavouriteMichis();
  }
}

async function uploadMichiPhoto() {
  const form = document.getElementById('uploadingForm');
  const formData = new FormData(form);

  console.log(formData.get('file'));

  const res = await fetch(API_URL_UPLOAD, {
    method: 'POST',
    headers: {
      'X-API-KEY': 'live_I3MTEobcZ7VA7v90Pp6mENwT0UgddpfPeYn3bE0mHc6llTAKRxBhwPQxJIe2kylb',
    },
    body: formData,
  });

  const data = await res.json();

  if (res.status !== 201) {
    spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`
  } else {
      console.log("Foto de michi cargada :)");
      console.log({ data });
      console.log(data.url);
      saveFavouriteMichi(data.id) //para agregar el michi cargado a favoritos.
  }
}

function showMiniature() {
  const form = document.getElementById('uploadingForm');
  const formData = new FormData(form);
  const reader = new FileReader();

  const preview = document.getElementById('preview');

  if (preview) {    
    form.removeChild(preview);
  }

  reader.readAsDataURL(formData.get('file'));

  reader.onload = () => {
    const previewImage = document.createElement('img');
    previewImage.id = 'preview';
    previewImage.width = 50;
    previewImage.src = reader.result;
    previewImage.style.marginBottom = '20px';

    const fileInput = document.getElementById('file');
    form.insertBefore(previewImage, fileInput.nextSibling);
  }
}

loadRandomMichis();
loadFavouriteMichis();