document.addEventListener('DOMContentLoaded', () => {
  const btnItemNew = document.getElementById('btn-item-new');
  const btnCategoryNew = document.getElementById('btn-category-new');
  const selectCategory = document.getElementById('select-category');

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
});