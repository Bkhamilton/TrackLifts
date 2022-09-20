export class Exercise {
    constructor(
        id,
        title,
        type,
        muscleGroup
    ) {
        this.id = id ? id : null;
        this.title = title ? title : null;
        this.type = type ? type : null;
        this.muscleGroup = muscleGroup ? muscleGroup : null;
    }
}

export class Routine {
    constructor(
        id,
        title,
    ) {
        this.id = id ? id : null;
        this.title = title ? title : null;
    }
}

export class TLRoutine {
    constructor(
        id,
        rid,
        exid
    ) {
        this.id = id ? id : null;
        this.rid = rid ? rid : null;
        this.exid = exid ? exid : null;
    }
}

export class Muscle {
    constructor(
        id,
        muscle,
    ) {
        this.id = id ? id : null;
        this.title = title ? title : null;
    }
}