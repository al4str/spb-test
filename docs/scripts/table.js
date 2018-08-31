const documentReady = () => new Promise((resolve) => {
  document.readyState === 'complete' ?
    resolve() :
    window.addEventListener('load', resolve, true);
});

const obtainData = () => {
  return new Promise((resolve) => {
    const url = location.protocol === 'file:' ?
      'http://localhost:5005' :
      '/data/data.json';
    fetch(url)
    .then((response) => {
      const reader = response.body.getReader();
      const stream = new ReadableStream({
        start(controller) {
          const push = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              push();
            });
          };
          push();
        },
      });
      return new Response(stream);
    })
    .then(response => response.json())
    .then(data => resolve(data));
  });
};

documentReady().then(() => {
  const statusesMap = {
    active: 'Actif',
    progress: 'En cours',
    suspended: 'Suspendu',
  };
  const packagesTypesMap = {
    can33cl: 'Canette 33Cl',
    bottle33cl: 'Bouteille 33Cl',
    bottle50cl: 'Bouteille 50Cl',
    longneck300ml: 'Longneck 300ml',
    longneck750ml: 'Longneck 750ml',
    sixpackrings: 'Six paquets de bagues',
    barrel: 'Fût',
  };
  const sortFilterMap = {
    name: {
      sorter: (a, b) => a.name.localeCompare(b.name),
      tester: (value, item) => new RegExp(value, 'gi').test(item.name),
    },
    status: {
      sorter: (a, b) => a.status - b.status,
      tester: (value, item) => value === item.status,
    },
    packageType: {
      sorter: (a, b) => a.packageType - b.packageType,
      tester: (value, item) => value === item.packageType,
    },
    provider: {
      sorter: (a, b) => a.provider.localeCompare(b.provider),
      tester: (value, item) => new RegExp(value, 'gi').test(item.provider),
    },
    plannedOn: {
      sorter: (a, b) => new Date(a.plannedOn) - new Date(b.plannedOn),
      tester: (value, item) => new Date(value).toLocaleDateString('fr-FR') ===
        new Date(item.plannedOn).toLocaleDateString('fr-FR'),
    },
    reference: {
      sorter: (a, b) => a.reference.localeCompare(b.reference),
      tester: (value, item) => new RegExp(value, 'gi').test(item.reference),
    },
    amountOrdered: {
      sorter: (a, b) => a.amountOrdered - b.amountOrdered,
      tester: (value, item) => parseInt(value, 10) === item.amountOrdered,
    },
  };

  Vue.component('table-top', {
    template: '#table-top-template',
  });

  Vue.component('table-head', {
    props: {
      columns: Array,
    },
    data() {
      return {
        selects: {
          status: statusesMap,
          packageType: packagesTypesMap,
        },
      };
    },
    template: '#table-head-template',
  });

  Vue.component('table-body', {
    props: {
      isPending: Boolean,
      currentPageItems: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        statusesMap,
        packagesTypesMap,
      };
    },
    template: '#table-body-template',
  });

  Vue.component('table-foot', {
    props: {
      currentPage: Number,
      perPageAmount: Number,
      itemsAmount: Number,
    },
    template: '#table-foot-template',
    computed: {
      pagesAmount() {
        const { perPageAmount, itemsAmount } = this;
        return Math.ceil(itemsAmount / perPageAmount) || 1;
      },
      pagesArray() {
        const { pagesAmount } = this;
        return new Array(pagesAmount).fill(null).map((n, i) => i + 1);
      },
      pagination() {
        const { currentPage, pagesAmount } = this;
        const prevButton = {
          key: 'prev',
          cap: '<',
          disabled: currentPage === 1,
          to: currentPage - 1,
        };
        const nextButton = {
          key: 'next',
          cap: '>',
          disabled: currentPage === pagesAmount,
          to: currentPage + 1,
        };
        const separator = {
          cap: '…',
          disabled: true,
        };
        const pagination = new Array(pagesAmount)
        .fill(null)
        .map((n, i) => {
          const pageNum = i + 1;
          return {
            key: `page-${pageNum}`,
            cap: pageNum,
            to: pageNum,
            current: pageNum === currentPage,
          };
        })
        .map(page => {
          const { to, current } = page;
          const isBefore = to < currentPage;
          const isAfter = to > currentPage;
          const isFirstTwo = to === 1 || to === 2;
          const isLastTwo = to === pagesAmount || to === pagesAmount - 1;
          if (pagesAmount < 5 || isFirstTwo || isLastTwo || current) {
            return page;
          }
          if (isBefore && to - 1 === 2 || isAfter && pagesAmount - to === 2) {
            return {
              key: `separator-${to < currentPage ? 'prev' : 'next'}`,
              ...separator,
            };
          }
        })
        .filter(page => !!page);
        return [prevButton, ...pagination, nextButton];
      },
    },
  });

  new Vue({
    el: '#app',
    template: '#app-template',
    data: {
      isPending: false,
      items: [],
      columns: [
        {
          name: 'name',
          cap: 'Nom de biére',
          sortType: false,
          filterValue: '',
          inputType: 'text',
        },
        {
          name: 'status',
          cap: 'Statut',
          sortType: false,
          filterValue: '',
          inputType: 'text',
        },
        {
          name: 'packageType',
          cap: 'Type de conditionnement',
          sortType: false,
          filterValue: '',
          inputType: 'text',
        },
        {
          name: 'provider',
          cap: 'Fournisseur',
          sortType: false,
          filterValue: '',
          inputType: 'text',
        },
        {
          name: 'plannedOn',
          cap: 'Réception prévue le',
          sortType: false,
          filterValue: '',
          inputType: 'date',
        },
        {
          name: 'reference',
          cap: 'Référence produit',
          sortType: false,
          filterValue: '',
          inputType: 'text',
        },
        {
          name: 'amountOrdered',
          cap: 'Quantités commandées',
          sortType: false,
          filterValue: '',
          inputType: 'number',
        },
        {
          name: 'actions',
          cap: 'Actions',
        },
      ],
      currentPage: 1,
      perPageAmount: 6,
    },
    created() {
      this.isPending = true;
      obtainData().then((data) => {
        this.items = data.map(item => ({
          isChecked: false,
          ...item,
        }));
        this.isPending = false;
      });
    },
    computed: {
      filteredItems() {
        const { items, columns } = this;
        return items.filter((item) => {
          let isIncluded = true;
          columns.forEach(({ name, filterValue }) => {
            if (filterValue === undefined || !filterValue.trim()) {
              return;
            }
            const test = sortFilterMap[name].tester(filterValue, item);
            if (!test) {
              isIncluded = false;
            }
          });
          return isIncluded;
        });
      },
      currentPageItems() {
        const { filteredItems, columns, currentPage, perPageAmount } = this;
        const sortColumn = columns.find(({ sortType }) => sortType !== undefined &&
          sortType !== false);
        const start = (currentPage - 1) * perPageAmount;
        const end = start + perPageAmount;
        let pageItems = filteredItems.slice(start, end);
        if (sortColumn) {
          const { name, sortType } = sortColumn;
          pageItems = pageItems.sort(sortFilterMap[name].sorter);
          if (sortType === 'desc') {
            pageItems = pageItems.reverse();
          }
        }
        return pageItems;
      },
    },
    methods: {
      checkAll(isChecked) {
        const { currentPageItems } = this;
        currentPageItems.forEach(item => {
          item.isChecked = isChecked;
        });
      },
      checkItem(itemId, isChecked) {
        const { currentPageItems } = this;
        const item = currentPageItems.find(({ id }) => id === itemId);
        if (!item) {
          return;
        }
        item.isChecked = isChecked;
      },
      applySort(columnName) {
        this.columns.forEach(({ name, sortType }, i) => {
          if (sortType === undefined) {
            return;
          }
          if (name === columnName) {
            let type;
            if (sortType === false) {
              type = 'asc';
            }
            else if (sortType === 'asc') {
              type = 'desc';
            }
            else {
              type = false;
            }
            this.columns[i].sortType = type;
          }
          else {
            this.columns[i].sortType = false;
          }
        });
      },
      applyFilter(columnName, value) {
        this.currentPage = 1;
        const column = this.columns.find(({ name }) => name === columnName);
        column.filterValue = value;
      },
      goToPage(page) {
        this.currentPage = parseInt(page);
      },
      setPerPageAmount(amount) {
        this.perPageAmount = parseInt(amount);
      },
    },
  });
});
