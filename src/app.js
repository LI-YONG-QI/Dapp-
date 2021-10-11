App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadAccount();
      await App.loadContract();
      await App.render();
    },
  
    loadAccount: async () => {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      console.log(accounts);
      App.account = accounts[0];
    },
  
    loadContract: async () => {
      //var contract = require("@truffle/contract");

      const todoList = await $.getJSON('TodoList.json');
  
      App.contracts.TodoList = TruffleContract(todoList);
      App.contracts.TodoList.setProvider(window.ethereum);
  
      // Hydrate the smart contract with values from the blockchain
      App.todoList = await App.contracts.TodoList.deployed();
    },
  
    render: async () => {
      // Prevent double render
      if (App.loading) {
        return;
      }
  
      // Update app loading state
      App.setLoading(true);
  
      // Render Account
      $('#account').html(App.account);
      console.log(App.account);
  
      // Render Tasks
      await App.renderTasks();

      $("#content").on("click",".delete", App.deleteTask);
      

      
      
      
      // Update loading state
      App.setLoading(false);
    },
  
    renderTasks: async () => {
      // Load the total task count from the blockchain+
      const taskCount = await App.todoList.taskCount();
      const $taskTemplate = $('.taskTemplate');
      //console.log("1");
      
  
      // Render out each task with a new task template
      for (var i = 1; i <= taskCount; i++) {
        // Fetch the task data from the blockchain
        const task = await App.todoList.tasks(i);
        const taskId = task[0].toNumber();
        const taskContent = task[1];
        const taskCompleted = task[2];
  
        // Create the html for the task
        const $newTaskTemplate = $taskTemplate.clone();
        $newTaskTemplate.find('.content').html(taskContent);
        $newTaskTemplate.prop('checked', App.toggleCompleted);
        $newTaskTemplate.find('input')
                        .prop('name', taskId)
                        .prop('checked', taskCompleted)
                        .on("click", App.toggleCompleted);
           
        // 非function問題 .on('.delete')可能藏有問題
        // Put the task in the correct list
        //$("label").on('click',".delete",App.printAlert);
        if (taskCompleted) {
          $('#completedTaskList').prepend($newTaskTemplate);
        } else {
          $('#taskList').prepend($newTaskTemplate);
        }
        // Show the task
        $newTaskTemplate.show();
        
      }
    },
  
    createTask: async () => {
      App.setLoading(true);
      const content = $('#newTask').val();
      await App.todoList.createTask(content, {from: App.account});
      window.location.reload();
    },
  
    toggleCompleted: async (e) => {
      App.setLoading(true);
      const $input = $(e.target).parent('label').find("input");
      const taskId = $input.prop("name");
      //const taskId = e.target.name;
      alert(taskId);
      await App.todoList.toggleCompleted(taskId, {from: App.account });
      window.location.reload();
    },

    setLoading: (boolean) => {
      App.loading = boolean;
      const loader = $('#loader');
      const content = $('#content');
      if (boolean) {
        loader.show();
        content.hide();
      } else {
        loader.hide();
        content.show();
      }
    },

    deleteTask: async(e) => {
      const $input = $(e.target).parent('label').find("input");
      const taskId = $input.prop("name");
      //alert(taskId)     //無法準確抓取點選到的任務 ex: 印出點選任務的內容(.content)
      await App.todoList.deleteTask(taskId, {from: App.account });
      window.location.reload();
    },

    renderId: async(e) => {
      const $input = $(e.target).parent('label').find("input");
      const taskId = $input.prop("name");
      alert(taskId)     //無法準確抓取點選到的任務 ex: 印出點選任務的內容(.content)
    }
}
  
$(() => {
  $(window).load(() => {
    App.load();
  })
})