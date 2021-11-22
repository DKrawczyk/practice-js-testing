import DB from './DB';

describe ('Insert method', () => {
    it ('Return message "ID can be only number", when data.id is not a number', async () => {
        //Czy wymagane w tym miejscu jest w tym przypadku expect.assertions(1); , skoro test przechodzi?
        const subject = new DB();

        try {
            await subject.insert({id:'a'});
        }
        catch (err){
            expect(err).toBe('ID can be only number!')
        }
    })

    it('Return message "ID can\'t be duplicated!", whe ID is duplicated', async () => {
        // Tu podobne pytanie: expect.assertions(1); stwierdziłem że będę dodawał
        //tylko tam gdzie jest rejects ale nie wiem czy to dobrze :D
        const subject = new DB();
        subject.insert({id:1});

        await subject.insert({id:1})

        await expect(subject.insert({id:1})).rejects.toBe('ID can\'t be duplicated!');
    });

    it ('Return automatically assign ID, when ID is not insert', async () => {

        const subject = new DB();
        await subject.insert({name: 'Dawid'});
        
        const newUserRow = await subject.getRows();

        await expect(newUserRow[0].id).toBe(1);
    });
});

describe ('Select method', () => {
    it ('Return row, when exist', async () => {

        const subject = new DB();
        const newUserID = {id: 1};
        const secondUserID = {id: 2};

        await subject.insert(newUserID);
        await subject.insert(secondUserID);

        await expect(subject.select(1)).resolves.toBe(newUserID);
        await expect(subject.select(2)).resolves.toBe(secondUserID);
    })

    it ('Reject, when ID is not found', async () => {
        expect.assertions(1)
        const subject = new DB();
        await expect(subject.select(2)).rejects.toBe('ID not found');
    });
});

describe ('Remove method', () => {

    it ('Return "Item not exist!" if id of item is no exist', async () => {
        expect.assertions(1);
        const subject = new DB();

        await expect(subject.remove(1)).rejects.toBe('Item not exist!');
    })

    it ('Chek if item was remove', async () => {

        const subject = new DB();
        const newUser = {name:'Dawid'}

        await subject.insert(newUser);
        await expect(subject.remove(1)).resolves.toBe('Item was remove!');

    });
});

describe ('Update method', () => {

    it ('Reject if ID was not set', async () => {
        expect.assertions(1)
        const subject = new DB();
        const newUser = {name:'Dawid'};

        await subject.insert(newUser);

        await expect(subject.update({name:'Dawid'})).rejects.toBe('ID have to be set!');
    });

    it ('Reject when ID is not found', async () => {
        expect.assertions(1)
        const subject = new DB();
        const newUser = {name:'Dawid', id:1};

        await subject.insert(newUser);

        const wrongIDUser = {name:'Dawid', id:2};
        await expect(subject.update(wrongIDUser)).rejects.toBe('ID not found!');
    });

    it ('Resolve when item was updated', async () => {

        const subject = new DB();
        const newUser = {name:'Dawid', id:1};

        await subject.insert(newUser);
        const updatedUser = {name:'innyDawid', id:1};

        await expect(subject.update(updatedUser)).resolves.toBe(updatedUser);
    });
});

describe('Truncate method', () => {

    it('Return true when resolved', async () => {
        // expect.assertions(1)
        const subject = new DB();
        const firstUser = {name:'Dawid', id:1};
        

        await subject.insert(firstUser);
        // await subject.insert(secondUser);

       await expect(subject.truncate()).resolves.toBe(true);
    });

    it('Check if this clear database', async () => {

        const subject = new DB();
        const firstUser = {name:'Dawid', id:1};
        const secondUser = {name:'InnyDawid', id:2}; 

        await subject.insert(firstUser);
        await subject.insert(secondUser);
    
        await subject.truncate();

        const checkDB = await subject.getRows();

        await expect(checkDB.length).toBe(0);
    });
});

describe('getRows method', () => {

    it('Should return array with datas', async () => {

        const subject = new DB();
        const newUser = {name:'Dawid', id:1};

        await subject.insert(newUser);
        const test = [newUser];

        await expect(subject.getRows()).resolves.toEqual(test);
    });

    it('Should return empty array', async () => {

        const subject = new DB();
        const expectArray = [];

        await expect(subject.getRows()).resolves.toEqual(expectArray);

    });

});