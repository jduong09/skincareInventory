document.addEventListener('DOMContentLoaded', () => {
  const btnItemNew = document.getElementById('btn-item-new');
  const btnCategoryNew = document.getElementById('btn-category-new');
  const selectCategory = document.getElementById('select-category');
  const btnsUpdateItem = document.getElementsByClassName('btn-update-item');
  // const btnsDeleteItem = document.getElementsByClassName('btn-delete-item');

  btnItemNew.addEventListener('click', (e) => {
    e.preventDefault();

    window.location = `/item/new`;
  });

  btnCategoryNew.addEventListener('click', (e) => {
    e.preventDefault();

    const divCategoryNew = document.getElementById('div-category-new');
    divCategoryNew.classList.remove('hide');
  });

  selectCategory.addEventListener('onchange', (e) => {
    console.log(e.currentTarget.value);
  });

  for (let i = 0; i < btnsUpdateItem.length; i++) {
    btnsUpdateItem[i].addEventListener('click', (e) => {
      e.preventDefault();

      const parentEle = e.currentTarget.parentElement.parentElement;
      const dataItemId = parentEle.getAttribute('data-item-id');

      window.location = `items/${dataItemId}/update`;
    });
  }
});