var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),

    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

var vertexColors = [
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
];

class Player extends WebGLObject {

    constructor(vec3_, size = 1, id = 0, hasLine = false, trans = false) {
        super(vec3_[0], vec3_[1], vec3_[2], size, id, hasLine, trans);
        this.mVertices = [];
        this.isJumping = false
        this.colorState = 0;
    }

    count = 0;

    mVertices;
    mColors;

    callbackAction(a, b) { }

    subAction(a, b) { }

    gravityAction(a, b) { }

    // No Gradation
    setColor(vec4List = 0) {
        this.mColors = [];
        if (vec4List != 0) {
            vec4List.forEach(element => {
                for (var k = 0; k < 6; k++) {
                    this.mColors.push(element)
                }
            });
        }
        return this;
    }

    setColor_GL(vec4List_List = 0) {
        this.mColors = [];
        if (vec4List_List != 0) {
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 6; j++) {
                    this.mColors.push(vec4List_List[i][j]);
                }
            }
        }
        return this;
    }

    setOneColor(cr = 0) {
        this.mColors = [];
        if (cr != 0) {
            for (var k = 0; k < 36; k++) {
                this.mColors.push(cr)
            }
        }

        return this;
    }

    quad(a, b, c, d) {
        this.mVertices.push(vertices[a]);
        this.mVertices.push(vertices[b]);
        this.mVertices.push(vertices[c]);
        this.mVertices.push(vertices[a]);
        this.mVertices.push(vertices[c]);
        this.mVertices.push(vertices[d]);

        this.count += 6;
    }

    colorCube() {
        this.quad(1, 0, 3, 2);
        this.quad(2, 3, 7, 6);
        this.quad(3, 0, 4, 7);
        this.quad(6, 5, 1, 2);
        this.quad(4, 5, 6, 7);
        this.quad(5, 4, 0, 1);

        this.mVertices.forEach((element, index, _) => {
            this.mVertices[index] = vec4(
                element[0] * this.size + this.x,
                element[1] * this.size + this.y,
                element[2] * this.size + this.z,
                element[3])
        });

        if (this.hasLine) {
            this.lining();
        }
    }

    lining() {
        for (let k = 0; k < 4; k++) {
            let aft = (k + 1) % 4;
            this.mLineVertices.push(vertices[k]);
            this.mLineVertices.push(vertices[aft]);
            this.mLineVertices.push(vertices[k + 4]);
            this.mLineVertices.push(vertices[aft + 4]);
            this.mLineVertices.push(vertices[k]);
            this.mLineVertices.push(vertices[k + 4]);
        }

        this.mLineVertices.forEach((element, index, arr) => {
            this.mLineVertices[index] = vec4(
                element[0] * this.size + this.x,
                element[1] * this.size + this.y,
                element[2] * this.size + this.z,
                element[3])

        })
    }

    resizing(size) {
        this.mVertices.forEach((element, index, _) => {
            this.mVertices[index] = vec4(
                ((element[0] - this.x) / this.size) * size + this.x,
                ((element[1] - this.y) / this.size) * size + this.y,
                ((element[2] - this.z) / this.size) * size + this.z,
                element[3])
        });
        if (this.hasLine) {
            this.mLineVertices.forEach((element, index, arr) => {
                this.mLineVertices[index] = vec4(
                    ((element[0] - this.x) / this.size) * size + this.x,
                    ((element[1] - this.y) / this.size) * size + this.y,
                    ((element[2] - this.z) / this.size) * size + this.z,
                    element[3])
            })
        }
        this.size = size
    }

    setCallbackAction(callback) {
        this.callbackAction = callback;

        return this;
    }

    setGravityAction(floors) {
        this.gravityAction = (_, element)=>{
            let bool = true;
            let xf = -1;

            floors.forEach((floor, index, _) =>{
                if ((element.y - element.size / 2) <= floor.y + floor.size / 2 &&
                (element.y + element.size / 2) >= floor.y - floor.size / 2 &&
                (element.z - element.size / 2) <= floor.z + floor.size / 2 &&
                (element.z + element.size / 2) >= floor.z - floor.size / 2 &&
                (element.x - element.size / 2) <= floor.x + floor.size / 2) {
                // element.teleportX(floor.x + floor.size / 2 + element.size / 2)
                bool = false;
                xf = index;
            } 
            })

            if(bool){
                element.move(-0.08, 0, 0, true)
            }else{
                element.teleportX(floors[xf].x + floors[xf].size / 2 + element.size / 2)
            }
        }
        // {
        //     if ((element.y - element.size / 2) <= floor.y + floor.size / 2 &&
        //         (element.y + element.size / 2) >= floor.y - floor.size / 2 &&
        //         (element.z - element.size / 2) <= floor.z + floor.size / 2 &&
        //         (element.z + element.size / 2) >= floor.z - floor.size / 2 &&
        //         (element.x - element.size / 2) <= floor.x + floor.size / 2) {
        //         element.teleportX(floor.x + floor.size / 2 + element.size / 2)
        //     } else {
        //         element.move(-0.08, 0, 0)
        //     }

        //     if (element.x <= floor.x - floor.size / 2) {
        //         element.teleport(floor.x + floor.size / 2 + element.size / 2, floor.y, floor.z)
        //     }
        // }
        return this;
    }

    setRotationByX(speed = 0) {
        this.mVertices.forEach((element, index, _) => {
            let mx = element[0];
            let my = element[1] - this.y;
            let mz = element[2] - this.z;

            let mY = (my * Math.cos(speed) - mz * Math.sin(speed)) + this.y

            let mZ = (my * Math.sin(speed) + mz * Math.cos(speed)) + this.z

            this.mVertices[index] = vec4(
                mx,
                mY,
                mZ,
                element[3])
        });
        if (this.hasLine) {
            this.mLineVertices.forEach((element, index, _) => {
                let mx = element[0];
                let my = element[1] - this.y;
                let mz = element[2] - this.z;

                let mY = (my * Math.cos(speed) - mz * Math.sin(speed)) + this.y

                let mZ = (my * Math.sin(speed) + mz * Math.cos(speed)) + this.z

                this.mLineVertices[index] = vec4(
                    mx,
                    mY,
                    mZ,
                    element[3])
            });
        }
    }

    setRotationByY(speed = 0) {
        this.mVertices.forEach((element, index, _) => {

            let mx = element[0] - this.x;
            let my = element[1];
            let mz = element[2] - this.z;

            let mZ = (mz * Math.cos(speed) - mx * Math.sin(speed)) + this.z
            let mX = (mz * Math.sin(speed) + mx * Math.cos(speed)) + this.x

            this.mVertices[index] = vec4(
                mX,
                my,
                mZ,
                element[3])
        });
        if (this.hasLine) {
            this.mLineVertices.forEach((element, index, _) => {

                let mx = element[0] - this.x;
                let my = element[1];
                let mz = element[2] - this.z;

                let mZ = (mz * Math.cos(speed) - mx * Math.sin(speed)) + this.z
                let mX = (mz * Math.sin(speed) + mx * Math.cos(speed)) + this.x

                this.mLineVertices[index] = vec4(
                    mX,
                    my,
                    mZ,
                    element[3])
            });
        }
    }
    setRotationByZ(speed = 0) {
        this.mVertices.forEach((element, index, _) => {

            let mx = element[0] - this.x;
            let my = element[1] - this.y;
            let mz = element[2];

            let mX = (mx * Math.cos(speed) - my * Math.sin(speed)) + this.x
            let mY = (mx * Math.sin(speed) + my * Math.cos(speed)) + this.y

            this.mVertices[index] = vec4(
                mX,
                mY,
                mz,
                element[3])
        });
        if (this.hasLine) {
            this.mLineVertices.forEach((element, index, _) => {

                let mx = element[0] - this.x;
                let my = element[1] - this.y;
                let mz = element[2];

                let mX = (mx * Math.cos(speed) - my * Math.sin(speed)) + this.x
                let mY = (mx * Math.sin(speed) + my * Math.cos(speed)) + this.y

                this.mLineVertices[index] = vec4(
                    mX,
                    mY,
                    mz,
                    element[3])
            });
        }
    }

    changeColor() {
        this.setOneColor(vertexColors[(this.colorState++) % 6])
    }

    move(x, y, z, isJump = false) {
        if(true){
            this.x += x;
            this.y += y;
            this.z += z;
        }else{
            let eye = PaleGL.information.eye;
            let vecValue = Math.sqrt(Math.pow(this.x - eye[0], 2) + Math.pow(this.y - eye[1], 2)+ Math.pow( this.z - eye[2], 2), 2)

            let mVector = vec3(
                (this.x - eye[0]) / vecValue,
                (this.y - eye[1]) / vecValue,
                (this.z - eye[2]) / vecValue)

            let siz = Math.sqrt(Math.pow(mVector[0],2) + Math.pow(mVector[1],2))
            let realVctor  =vec3(
                mVector[0]/siz,
                mVector[1]/siz,
                0
            )   

            this.x += realVctor[0]
            this.y += realVctor[1]
            
        }
      
        this.mVertices.forEach((element, index, _) => {
            this.mVertices[index] = vec4(
                element[0] + x,
                element[1] + y,
                element[2] + z,
                element[3])
        });

        if (this.hasLine) {
            this.mLineVertices.forEach((element, index, _) => {
                this.mLineVertices[index] = vec4(
                    element[0] + x,
                    element[1] + y,
                    element[2] + z,
                    element[3])
            });
        }
    }

    teleport(x, y, z) {
        this.mVertices.forEach((element, index, _) => {
            this.mVertices[index] = vec4(
                element[0] - this.x + x,
                element[1] - this.y + y,
                element[2] - this.z + z,
                element[3])
        });

        if (this.hasLine) {
            this.mLineVertices.forEach((element, index, _) => {
                this.mLineVertices[index] = vec4(
                    element[0] - this.x + x,
                    element[1] - this.y + y,
                    element[2] - this.z + z,
                    element[3])
            });
        }

        this.x = x;
        this.y = y;
        this.z = z;
    }

    teleportX(x) {
        this.mVertices.forEach((element, index, _) => {
            this.mVertices[index] = vec4(
                element[0] - this.x + x,
                element[1],
                element[2],
                element[3])
        });

        if (this.hasLine) {
            this.mLineVertices.forEach((element, index, _) => {
                this.mLineVertices[index] = vec4(
                    element[0] - this.x + x,
                    element[1],
                    element[2],
                    element[3])
            });
        }

        this.x = x;
    }

    jump(zS) {
        if (this.isJumping) return;

        this.isJumping = true;

        let k = this.x;

        this.subAction = (_, element) => {
            if (element.x >= zS) {
                element.isJumping = false;
                element.subAction = () => { }
                //element.move(0.08 * -krt, 0, 0)
            } else {

                element.move(0.16, 0, 0, this.isJumping)
            }
        }
    }

    // finally, You should call this method.

    using() {
        if (this.mColors.length == 0) {
            this.setOneColor(vec4(1, 1, 1, 0))
        }

        this.colorCube();

        return this;
    }
}