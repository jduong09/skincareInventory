document.addEventListener('DOMContentLoaded', () => {
  const btnItemNew = document.getElementById('btn-item-new');
  const btnCategoryNew = document.getElementById('btn-category-new');
  const selectCategory = document.getElementById('select-category');
  const btnsUpdateItem = document.getElementsByClassName('btn-update-item');
  const btnsDeleteItem = document.getElementsByClassName('btn-delete-item');
  const arrayItems = document.getElementsByClassName('li-item');

  btnItemNew.addEventListener('click', (e) => {
    e.preventDefault();

    window.location = `/item/new`;
  });

  btnCategoryNew.addEventListener('click', (e) => {
    e.preventDefault();

    const divCategoryNew = document.getElementById('div-category-new');
    divCategoryNew.classList.remove('hide');
  });

  selectCategory.addEventListener('change', (e) => {
    e.preventDefault();

    const filterValue = e.currentTarget.value;

    if (filterValue === '') {
      window.location = '/';
    } else {
      window.location = `/?category=${filterValue}`;
    }
  });

  for (let i = 0; i < btnsUpdateItem.length; i++) {
    btnsUpdateItem[i].addEventListener('click', (e) => {
      e.preventDefault();

      const parentEle = e.currentTarget.parentElement.parentElement;
      const dataItemId = parentEle.getAttribute('data-item-id');

      window.location = `items/${dataItemId}/update`;
    });
  }

  for (let k = 0; k < btnsDeleteItem.length; k++) {
    btnsDeleteItem[k].addEventListener('click', (e) => {
      e.preventDefault();

      const parentEle = e.currentTarget.parentElement.parentElement;
      const dataItemId = parentEle.getAttribute('data-item-id');

      fetch(`items/${dataItemId}/delete`, {
        method: 'DELETE'
      }).then((res) => {
        console.log(res.message);
      }).catch((err) => {
        console.log(err.message);
      })
    })
  }

  for (let l = 0; l < arrayItems.length; l++) {
    arrayItems[l].addEventListener('click', (e) => {
      e.preventDefault();

      const dataId = e.currentTarget.getAttribute('data-item-id');

      window.location = `/items/${dataId}`;
    });
  }
});