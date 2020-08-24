

      let library = [];

      function Book(title, author, pages, readBool){
          this.title = title;
          this.author = author;
          this.pages = pages;
          this.readBool = readBool;

      }

      Book.prototype.addBook =  function(){
          console.log("pushing book to library:" + this);
          library.push(this);
      }


      Book.prototype.deleteBook = function(){
          library = library.filter(book => book !== this);
          //depending on implementation, remove card from DOM
      }

      const bookAreaParentDiv = document.querySelector("#bookArea");
      const addButtonCardDiv = document.querySelector("#addButtonCard");

      function constructCard(book){
          //create new div as bookArea child
          let currentCard = document.createElement("div");
          currentCard.classList.add("bookCard");

          //create new div for storing the title and add bookTitle class to it
          let currentCardTitle = document.createElement("div");
          currentCardTitle.classList.add("bookTitle");
          currentCardTitle.textContent = book.title;
          currentCard.appendChild(currentCardTitle);

          //create div for author
          let currentCardAuthor = document.createElement("div");
          currentCardAuthor.classList.add("bookAuthor");
          currentCardAuthor.textContent = book.author;
          currentCard.appendChild(currentCardAuthor);

          //create div for pages
          let currentCardPages = document.createElement("div");
          currentCardPages.classList.add("bookPages");
          if(book.pages){
              currentCardPages.textContent = book.pages + " pages";
          }
          else{
              currentCardPages.textContent = "";
          }
          currentCard.appendChild(currentCardPages);

          //create button for read add event listener to add or remove the read style with

          //button area add
              
          
          let buttonAreaReference = document.createElement("div");
          buttonAreaReference.classList.add("ButtonArea");

          //read button add
          let readButtonReference = document.createElement("div");
          readButtonReference.classList.add("readButton");
          readButtonReference.textContent = "Read";
          readButtonReference.addEventListener("click", function() {bookRead(this, book)});
          buttonAreaReference.appendChild(readButtonReference);

          if(book.readBool){
          currentCard.classList.toggle("bookRead");
          }

          //delete button add
          let deleteButtonReference = document.createElement("div");
          deleteButtonReference.classList.add("deleteButton");
          deleteButtonReference.textContent = "Delete";
          deleteButtonReference.addEventListener("click", function() {deleteBook(this, book)});
          buttonAreaReference.appendChild(deleteButtonReference);

          currentCard.appendChild(buttonAreaReference);



          bookAreaParentDiv.insertBefore(currentCard, addButtonCardDiv); 
      }


      function deleteBook(e, book){
          e.parentElement.parentElement.remove();
          console.log("delete");
          deletefromDB(book);
          book.deleteBook();
      }

      function bookRead(div, book){
          div.parentElement.parentElement.classList.toggle("bookRead");
          if(book.readBool){
             book.readBool = false;
          }
          else{
              book.readBool = true;
          }
          console.log(book.readBool);
      }

      let rendered = false;

      function renderLibrary(){
          if(rendered){
              console.log("rendering new card");
              constructCard(library[library.length -1]);
          }
          else{
              console.log("initial render commencing");
              console.log("rendering on " + library);
              for(i = 0; i < library.length; i++){
              constructCard(library[i]);
              rendered = true;
          }
          }
      }

      let addClicked = false;

      function addButtonFunction(){
          if(addClicked){
              createBook();
              dropDownToggle();
              addClicked = false;
          }
          else{
              dropDownToggle();
              addClicked = true;
          }
      }

      function dropDownToggle(){
          const formReference = document.querySelector("#addButtonForm");
          formReference.classList.toggle("addButtonFormToggle");
      }

      function createBook(){
          let title = document.querySelector("#titleInput").value;
          let author = document.querySelector("#authorInput").value;
          let pages = document.querySelector("#pagesInput").value;
          let read = document.querySelector("#readInput").checked;

          if(title == ""){
              title = "My Book";
          }

          //reset addbutton values
          document.querySelector("#titleInput").value = "";
          document.querySelector("#authorInput").value = "";
          document.querySelector("#pagesInput").value = "";
          document.querySelector("#readInput").checked = false;


          const newBook = new Book(title, author, pages, read);
          console.log("creating newbook:" + newBook);
          newBook.addBook();
          pushtoDB(newBook);

          renderLibrary();
      }


      let addButtonReference = document.querySelector("#addButton");
      addButton.addEventListener("click", addButtonFunction); 




      let keysDict = {};

      function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
      }
      
    

        function pushtoDB(book){
            let postData = {
                title: book.title,
                author: book.author,
                pages: book.pages,
                readBool: book.readBool
            }

            let postKey = book.title + book.author + book.pages;

            postKey = postKey.replace(/\s/g, "");
            console.log("pushing new book: " + postKey);
            console.log("new book data: " + postData);


            ;
            let updates = {};
            updates[postKey] = postData;

            keysDict[postKey] = book;

            firebase.database().ref().update(updates);




        }

        function deletefromDB(book){
            firebase.database().ref().child(getKeyByValue(keysDict, book)).remove();

        }


         function pullFromDB(){
            console.log("pulling");
            myLibrary.once('value', async function (snapshot){
                let dbVal = await snapshot.val();
                console.log(dbVal);
                for(entry in dbVal){
                    let tempBookObj = dbVal[entry];
                    tempBook = new Book(tempBookObj.title, tempBookObj.author, tempBookObj.pages, tempBookObj.readBool);
                    keysDict[entry] = tempBook;
                    tempBook.addBook();
                }
                renderLibrary();


            })


        }

    async function startUp(){
        myLibrary = firebase.database().ref();

        pullFromDB();
        
        renderLibrary();

    }

    startUp();


